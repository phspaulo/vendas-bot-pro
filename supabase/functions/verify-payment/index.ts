
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      throw new Error("Session ID é obrigatório");
    }

    console.log('🔍 Verificando pagamento para sessão:', sessionId);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2024-04-10",
    });

    // Verificar sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Buscar pagamento no banco
    const { data: payment, error } = await supabase
      .from("pagamentos")
      .select("*")
      .eq("stripe_session", sessionId)
      .single();

    if (error) {
      console.error('❌ Erro ao buscar pagamento:', error);
      throw new Error("Pagamento não encontrado");
    }

    const isPaid = session.payment_status === 'paid';
    
    console.log('💰 Status do pagamento:', {
      stripeStatus: session.payment_status,
      dbStatus: payment.status,
      isPaid
    });

    return new Response(
      JSON.stringify({
        isPaid,
        paymentStatus: session.payment_status,
        businessData: {
          businessName: payment.business_name,
          segment: payment.business_segment,
          whatsapp: payment.business_whatsapp,
          email: payment.email,
          address: payment.business_address,
          socialMediaLink: payment.business_social_media,
          description: payment.business_description,
        },
        amount: payment.valor,
        currency: payment.moeda,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Erro ao verificar pagamento:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
