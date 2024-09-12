// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Hello from failed Functions!");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Supabase Service Role Key are required.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const activeTimers: { [key: string]: number } = {};

serve(async (req) => {
  try {
    const { donation_id } = await req.json(); // Parse the JSON body

    console.log("Received request with donation_id:", donation_id);

    if (!donation_id) {
      console.error("Donation ID is required");
      return new Response(
        JSON.stringify({ error: "Donation ID is required" }),
        { status: 400 },
      );
    }

    if (req.method === "DELETE") {
      // Handle cancellation of the timer
      if (activeTimers[donation_id]) {
        clearTimeout(activeTimers[donation_id]);
        delete activeTimers[donation_id];
        console.log(`Timer for donation ${donation_id} canceled.`);
      }

      await supabase
        .from("donation_timers")
        .update({ timer_canceled: true })
        .eq("donation_id", donation_id);

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (req.method === "POST") {
      const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes for testing

      // Insert timer details into the donation_timers table
      const { error: timerError } = await supabase
        .from("donation_timers")
        .insert([{
          donation_id,
          expiration_time: expirationTime.toISOString(),
        }]);

      if (timerError) {
        console.error("Error inserting into donation_timers:", timerError);
        return new Response(
          JSON.stringify({ error: "Failed to start timer" }),
          { status: 500 },
        );
      }

      activeTimers[donation_id] = setTimeout(async () => {
        // Check if the donation is already completed or failed
        const { data: donation, error } = await supabase
          .from("donation")
          .select("status, donationRequest_ID")
          .eq("id", donation_id)
          .single();

        if (error) {
          console.error("Error fetching donation:", error);
          return;
        }


        if (donation.status === "COMPLETE" || donation.status === "FAILED") {
          console.log(`Donation ${donation_id} is already completed or failed. No action needed.`);
    
          // Mark the timer as canceled in the donation_timers table
          await supabase
              .from("donation_timers")
              .update({ timer_canceled: true })
              .eq("donation_id", donation_id);
    
          return;
        }
    

        console.log(`Marking donation ${donation_id} as FAILED.`);

    await supabase
      .from("donation")
      .update({ status: "FAILED", timer_trigger: false })
      .eq("id", donation_id);

    await supabase
      .from("item")
      .update({ status: "AVAILABLE" })
      .eq("donationRequest_ID", donation.donationRequest_ID);

    delete activeTimers[donation_id];
        console.log(`Donation ${donation_id} marked as FAILED.`);
      }, 5 * 60 * 1000); // 5 minutes for testing

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid method" }), {
      status: 400,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 },
    );
  }
});
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/failExpiredDonations' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
