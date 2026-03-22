import { SupabaseClient } from "@supabase/supabase-js";
import {
  FREE_LIKES_PER_PULSE,
  PRO_LIKES_PER_PULSE,
  PRO_MAX_STACKED_PULSES,
  PULSE_INTERVAL_HOURS,
} from "@/lib/constants";

export async function getActivePulses(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("pulses")
    .select("*")
    .eq("user_id", userId)
    .gt("expires_at", new Date().toISOString())
    .gt("likes_remaining", 0)
    .order("expires_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getTotalLikesRemaining(supabase: SupabaseClient, userId: string) {
  const pulses = await getActivePulses(supabase, userId);
  return pulses.reduce((sum, p) => sum + p.likes_remaining, 0);
}

export async function claimPulse(supabase: SupabaseClient, userId: string, isPro: boolean) {
  const activePulses = await getActivePulses(supabase, userId);
  const maxPulses = isPro ? PRO_MAX_STACKED_PULSES : 1;

  if (activePulses.length >= maxPulses) {
    return { error: "You already have an active pulse. Use your likes before claiming again." };
  }

  const likes = isPro ? PRO_LIKES_PER_PULSE : FREE_LIKES_PER_PULSE;
  const expiresAt = new Date(
    Date.now() + PULSE_INTERVAL_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("pulses")
    .insert({
      user_id: userId,
      likes_remaining: likes,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) throw error;
  return { pulse: data };
}

export async function spendLikes(
  supabase: SupabaseClient,
  userId: string,
  count: number
) {
  const pulses = await getActivePulses(supabase, userId);
  let remaining = count;

  for (const pulse of pulses) {
    if (remaining <= 0) break;
    const toSpend = Math.min(remaining, pulse.likes_remaining);
    const { error } = await supabase
      .from("pulses")
      .update({ likes_remaining: pulse.likes_remaining - toSpend })
      .eq("id", pulse.id);

    if (error) throw error;
    remaining -= toSpend;
  }

  if (remaining > 0) {
    return { error: "Not enough likes remaining" };
  }

  return { success: true };
}
