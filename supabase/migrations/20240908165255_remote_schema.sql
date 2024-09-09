drop function if exists "public"."update_donation_request_status"(donation_request_id integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_donation_request_status(donationrequest_id bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_items INT;
    complete_items INT;
    pending_items INT;
BEGIN
    -- Count total items, completed items, and pending items
    SELECT COUNT(*) INTO total_items FROM item WHERE "donationRequest_ID" = donationRequest_ID;
    SELECT COUNT(*) INTO complete_items FROM item WHERE "donationRequest_ID" = donationRequest_ID AND status = 'COMPLETE';
    SELECT COUNT(*) INTO pending_items FROM item WHERE "donationRequest_ID" = donationRequest_ID AND status = 'PENDING';

    IF complete_items = total_items THEN
        -- All items are complete
        UPDATE "donationRequest" SET status = 'COMPLETE' WHERE id = donationRequest_ID;
    ELSIF pending_items > 0 THEN
        -- Some items are pending
        UPDATE "donationRequest" SET status = 'PENDING' WHERE id = donationRequest_ID;
    ELSE
        -- No items are pending or complete, so the request is still available
        UPDATE "donationRequest" SET status = 'AVAILABLE' WHERE id = donationRequest_ID;
    END IF;
END;
$function$
;

create or replace view "public"."donation_with_details" as  SELECT donation.id AS donation_id,
    donation.status AS donation_status,
    donation."donor_ID",
    donation."beneficiary_ID",
    "donationRequest".headline AS donation_request_headline,
    "donationRequest".id AS "donationRequest_ID",
    "donationRequest".images,
    "donationRequest".formatted_address AS donation_request_address,
    item.name AS item_name,
    item.status AS item_status,
    donation_timers.expiration_time,
    donation_timers.timer_start_time,
    donation_timers.timer_canceled,
    profiles.first_name,
    profiles.last_name,
    profiles.phone_number
   FROM (((((donation
     JOIN "donationRequest" ON ((donation."donationRequest_ID" = "donationRequest".id)))
     JOIN donation_timers ON ((donation.id = donation_timers.donation_id)))
     JOIN donation_items ON ((donation.id = donation_items."donation_ID")))
     JOIN item ON ((donation_items."item_ID" = item.id)))
     JOIN profiles ON ((donation."donor_ID" = profiles.id)));


CREATE OR REPLACE FUNCTION public.trigger_update_donation_request_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Call the function to update the donationRequest status
    PERFORM update_donation_request_status(NEW."donationRequest_ID");
    RETURN NEW;
END;$function$
;


