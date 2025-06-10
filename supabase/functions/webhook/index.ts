
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get('Stripe-Signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
    
    console.log('Webhook recebido:', event.type)
  } catch (err) {
    console.error('Erro na validação do webhook:', err.message)
    return new Response(err.message, { status: 400 })
  }

  // Processa o evento de pagamento confirmado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    console.log('Sessão completada:', session.id)
    console.log('Customer email:', session.customer_details?.email)
    console.log('Client reference ID:', session.client_reference_id)

    try {
      // Salva o pagamento no banco de dados
      const { error } = await supabase
        .from('pagamentos')
        .insert({
          email: session.customer_details?.email || 'guest@example.com',
          status: 'pago',
          stripe_session: session.id,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Erro ao salvar pagamento:', error)
        return new Response(JSON.stringify({ error: 'Erro no banco de dados' }), { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log('Pagamento salvo com sucesso para:', session.customer_details?.email)

    } catch (dbError) {
      console.error('Erro na operação do banco:', dbError)
      return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }

  return new Response(JSON.stringify({ received: true }), { 
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
