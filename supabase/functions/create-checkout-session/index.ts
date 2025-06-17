
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
    const { businessData, userId, userEmail } = await req.json();
    
    console.log('🚀 Criando sessão de checkout para:', userEmail);
    console.log('📋 Dados do negócio:', businessData);
    
    // Validações básicas
    if (!businessData?.businessName || !businessData?.email || !businessData?.whatsapp) {
      throw new Error("Dados obrigatórios do negócio não fornecidos");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2024-04-10",
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "🤖 Chatbot Personalizado para WhatsApp",
              description: `Chatbot automatizado para ${businessData.businessName} - Segmento: ${businessData.segment}`,
              images: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300"],
            },
            unit_amount: 2990, // R$ 29,90 em centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      customer_email: businessData.email,
      metadata: {
        userId: userId || 'guest',
        businessName: businessData.businessName || "",
        segment: businessData.segment || "",
        whatsapp: businessData.whatsapp || "",
        email: businessData.email || "",
        address: businessData.address || "",
        socialMediaLink: businessData.socialMediaLink || "",
        description: businessData.description || "",
      },
    });

    console.log('✅ Sessão criada com sucesso:', session.id);

    // Create initial payment record
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: insertError } = await supabase.from("pagamentos").insert({
      email: businessData.email,
      nome: businessData.businessName,
      status: "processando",
      stripe_session: session.id,
      valor: 2990,
      moeda: "brl",
      business_name: businessData.businessName,
      business_segment: businessData.segment,
      business_whatsapp: businessData.whatsapp,
      business_address: businessData.address,
      business_social_media: businessData.socialMediaLink,
      business_description: businessData.description,
    });

    if (insertError) {
      console.error('❌ Erro ao criar registro inicial:', insertError);
    } else {
      console.log('✅ Registro inicial criado com sucesso');
    }

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Erro ao criar sessão:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
