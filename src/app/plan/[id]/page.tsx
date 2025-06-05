'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function PlanPage() {
  const params = useParams();
  const planId = params?.id as string;

  const [plan, setPlan] = useState<any>(null);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);

  // Fetch plan
  useEffect(() => {
    if (!planId) return;

    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) {
        console.error('Error fetching plan:', error?.message || error);
        return;
      }

      setPlan(data);
    };

    fetchPlan();
  }, [planId]);

  // Fetch RSVPs
  useEffect(() => {
    if (!planId) return;

    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('plan_id', planId);

      if (error) {
        console.error('Error fetching participants:', error);
        return;
      }

      setParticipants(data);
    };

    fetchParticipants();
  }, [planId, submitted]);

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Please enter a name');

    const { error } = await supabase
      .from('participants')
      .insert({ plan_id: planId, name });

    if (error) {
      alert('Something went wrong. Try again.');
      console.error('RSVP insert error:', error);
    } else {
      setSubmitted(true);
    }
  };

  if (!plan) return <p className="p-6 text-gray-600">Loading plan...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="bg-black text-white p-6 rounded-xl max-w-md w-full shadow-xl">
        <h1 className="text-2xl font-bold text-teal-400 mb-3">{plan.title}</h1>
        <p className="mb-1"><strong>Where:</strong> {plan.location}</p>
        <p className="mb-1">
          <strong>When:</strong>{' '}
          {plan.starts_at
            ? new Date(plan.starts_at).toLocaleString()
            : 'TBD'}
        </p>
        <p className="mb-4 italic">Vibes: {plan.vibes}</p>

        {!submitted ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-full text-black mb-3"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-full font-semibold"
            >
              I’m in!
            </button>
          </>
        ) : (
          <div className="text-green-400 font-semibold text-center mt-4">
            🎉 You're in, {name}!
          </div>
        )}

        {participants.length > 0 && (
          <div className="mt-6">
            <p className="font-bold text-white mb-2">Who's in:</p>
            <ul className="list-disc list-inside text-sm text-teal-200 space-y-1">
              {participants.map((p) => (
                <li key={p.id}>{p.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
