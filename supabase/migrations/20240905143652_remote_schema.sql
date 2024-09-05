drop trigger if exists "donation_update_trigger" on "public"."donation";

set check_function_bodies = off;

create or replace view "public"."donation_with_details" as  SELECT donation.id AS donation_id,
    donation.status AS donation_status,
    donation."donor_ID",
    donation."beneficiary_ID",
    "donationRequest".headline AS donation_request_headline,
    "donationRequest".formatted_address AS donation_request_address,
    item.name AS item_name,
    item.status AS item_status,
    donation_timers.expiration_time,
    donation_timers.timer_canceled
   FROM ((((donation
     JOIN "donationRequest" ON ((donation."donationRequest_ID" = "donationRequest".id)))
     JOIN donation_timers ON ((donation.id = donation_timers.donation_id)))
     JOIN donation_items ON ((donation.id = donation_items."donation_ID")))
     JOIN item ON ((donation_items."item_ID" = item.id)));


CREATE OR REPLACE FUNCTION public.trigger_update_donation_request_status()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Call the function to update the donationRequest status
    PERFORM update_donation_request_status(NEW.donationRequest_ID);
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_donation_request_status(donation_request_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_items INT;
    complete_items INT;
    pending_items INT;
BEGIN
    -- Count total items, completed items, and pending items
    SELECT COUNT(*) INTO total_items FROM item WHERE donationRequest_ID = donation_request_id;
    SELECT COUNT(*) INTO complete_items FROM item WHERE donationRequest_ID = donation_request_id AND status = 'COMPLETE';
    SELECT COUNT(*) INTO pending_items FROM item WHERE donationRequest_ID = donation_request_id AND status = 'PENDING';

    IF complete_items = total_items THEN
        -- All items are complete
        UPDATE donationRequest SET status = 'COMPLETE' WHERE id = donation_request_id;
    ELSIF pending_items > 0 THEN
        -- Some items are pending
        UPDATE donationRequest SET status = 'PENDING' WHERE id = donation_request_id;
    ELSE
        -- No items are pending or complete, so the request is still available
        UPDATE donationRequest SET status = 'AVAILABLE' WHERE id = donation_request_id;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cancel_donation_timer()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.status = 'COMPLETE' OR NEW.status = 'FAILED' THEN
        -- Set the timer_trigger to FALSE to indicate that the timer should be canceled
        NEW.timer_trigger := FALSE;
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE TRIGGER item_status_update_trigger AFTER UPDATE ON public.item FOR EACH ROW EXECUTE FUNCTION trigger_update_donation_request_status();

CREATE TRIGGER donation_update_trigger AFTER UPDATE ON public.donation FOR EACH ROW EXECUTE FUNCTION cancel_donation_timer();


