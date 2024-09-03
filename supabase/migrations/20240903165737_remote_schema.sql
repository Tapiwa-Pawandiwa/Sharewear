alter table "public"."donation" add column "timer_trigger" boolean default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.cancel_donation_timer()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NEW.status = 'COMPLETE' THEN
        -- Set the timer_trigger to FALSE to indicate the timer should be canceled
        NEW.timer_trigger := FALSE;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.start_donation_timer()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Set the timer_trigger to TRUE when a new donation is created
    NEW.timer_trigger := TRUE;
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER donation_insert_trigger AFTER INSERT ON public.donation FOR EACH ROW EXECUTE FUNCTION start_donation_timer();

CREATE TRIGGER donation_update_trigger AFTER UPDATE ON public.donation FOR EACH ROW WHEN ((old.status IS DISTINCT FROM new.status)) EXECUTE FUNCTION cancel_donation_timer();


