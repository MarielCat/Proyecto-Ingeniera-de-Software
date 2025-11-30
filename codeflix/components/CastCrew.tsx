'use client';
import HorizontalList from '@/components/HorizontalList';
import type { CastMember, CrewMember } from "@/types/codeflix";

interface Props {
  cast: CastMember[];
  director: CrewMember | null;
}

export default function CastCrew({ cast, director }: Props) {
  // Construir lista empezando por el director y luego los actores
  const cast_crew = [
    ...(director ? [{ ...director, role: 'Director', isDirector: true }] : []),
    ...cast.map(actor => ({ ...actor, role: actor.character, isDirector: false }))
  ];

  if (cast_crew.length === 0) return <p>No hay información de reparto disponible.</p>;

  return (
    <HorizontalList className="gap-6">
      {cast_crew.map((person, index) => (
        <div key={`${person.id}-${index}`} className="flex-shrink-0 w-32 text-center">
          <div className="relative rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform border border-[#00b8c455] bg-[#0a2a2f] aspect-[2/3]">
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00b8c4] to-[#0a2a2f] flex items-center justify-center">
                <span className="text-[#b2ecef] text-sm">Sin foto</span>
              </div>
            )}
          </div>
          <p className="mt-3 font-semibold text-[#00b8c4] text-sm truncate">{person.name}</p>
          <p className={`text-xs ${person.isDirector ? 'text-[#ff6b9d]' : 'text-[#b2ecef]'}`}>
            {person.role}
          </p>
        </div>
      ))}
    </HorizontalList>
  );
}
