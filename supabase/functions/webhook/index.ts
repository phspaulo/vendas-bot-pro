
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
    
    console.log('✅ Webhook recebido:', event.type)
  } catch (err) {
    console.error('❌ Erro na validação do webhook:', err.message)
    return new Response(err.message, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    console.log('💰 Sessão completada:', session.id)
    console.log('📧 Customer email:', session.customer_details?.email)
    console.log('💾 Metadata:', session.metadata)

    try {
      // Buscar o registro do pagamento existente
      const { data: existingPayment, error: fetchError } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('stripe_session', session.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar pagamento:', fetchError)
        throw fetchError
      }

      // Atualizar o pagamento para pago
      const { error: updateError } = await supabase
        .from('pagamentos')
        .upsert({
          email: session.customer_details?.email || session.metadata?.email || 'guest@example.com',
          nome: session.customer_details?.name || session.metadata?.businessName || '',
          status: 'pago',
          stripe_session: session.id,
          valor: session.amount_total || 2990,
          moeda: session.currency || 'brl',
          // Dados do negócio do metadata
          business_name: session.metadata?.businessName || '',
          business_segment: session.metadata?.segment || '',
          business_whatsapp: session.metadata?.whatsapp || '',
          business_address: session.metadata?.address || '',
          business_social_media: session.metadata?.socialMediaLink || '',
          business_description: session.metadata?.description || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'stripe_session'
        })

      if (updateError) {
        console.error('❌ Erro ao atualizar pagamento:', updateError)
        throw updateError
      }

      console.log('✅ Pagamento atualizado com sucesso para:', session.customer_details?.email)

    } catch (dbError) {
      console.error('❌ Erro na operação do banco:', dbError)
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
