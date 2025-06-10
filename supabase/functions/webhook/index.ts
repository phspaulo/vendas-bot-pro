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

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    console.error(err.message)
    return new Response(err.message, { status: 400 })
  }

  // Lida com o evento de pagamento confirmado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // A MÁGICA ACONTECE AQUI!
    // Pegamos o ID do usuário que definimos na criação da sessão
    const userId = session.client_reference_id 

    if (userId) {
      const { error } = await supabase
        .from('pagamentos')
        .insert({
          user_id: userId,
          email: session.customer_details?.email,
          status: 'pago',
          stripe_session_id: session.id,
        })

      if (error) {
        console.error('Erro ao salvar pagamento:', error)
        return new Response(JSON.stringify({ error: 'Erro no banco de dados' }), { status: 500 })
      }
    } else {
       console.error('ERRO GRAVE: Webhook recebido sem client_reference_id (userId)')
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
})
