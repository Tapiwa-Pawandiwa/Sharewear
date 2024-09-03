create sequence "public"."donation_timers_id_seq";

create table "public"."donation_timers" (
    "id" integer not null default nextval('donation_timers_id_seq'::regclass),
    "donation_id" integer not null,
    "timer_start_time" timestamp with time zone not null default now(),
    "expiration_time" timestamp with time zone not null,
    "timer_canceled" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter sequence "public"."donation_timers_id_seq" owned by "public"."donation_timers"."id";

CREATE UNIQUE INDEX donation_timers_pkey ON public.donation_timers USING btree (id);

alter table "public"."donation_timers" add constraint "donation_timers_pkey" PRIMARY KEY using index "donation_timers_pkey";

alter table "public"."donation_timers" add constraint "donation_timers_donation_id_fkey" FOREIGN KEY (donation_id) REFERENCES donation(id) ON DELETE CASCADE not valid;

alter table "public"."donation_timers" validate constraint "donation_timers_donation_id_fkey";

grant delete on table "public"."donation_timers" to "anon";

grant insert on table "public"."donation_timers" to "anon";

grant references on table "public"."donation_timers" to "anon";

grant select on table "public"."donation_timers" to "anon";

grant trigger on table "public"."donation_timers" to "anon";

grant truncate on table "public"."donation_timers" to "anon";

grant update on table "public"."donation_timers" to "anon";

grant delete on table "public"."donation_timers" to "authenticated";

grant insert on table "public"."donation_timers" to "authenticated";

grant references on table "public"."donation_timers" to "authenticated";

grant select on table "public"."donation_timers" to "authenticated";

grant trigger on table "public"."donation_timers" to "authenticated";

grant truncate on table "public"."donation_timers" to "authenticated";

grant update on table "public"."donation_timers" to "authenticated";

grant delete on table "public"."donation_timers" to "service_role";

grant insert on table "public"."donation_timers" to "service_role";

grant references on table "public"."donation_timers" to "service_role";

grant select on table "public"."donation_timers" to "service_role";

grant trigger on table "public"."donation_timers" to "service_role";

grant truncate on table "public"."donation_timers" to "service_role";

grant update on table "public"."donation_timers" to "service_role";


