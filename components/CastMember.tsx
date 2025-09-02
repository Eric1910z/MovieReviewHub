import React from 'react';
import { Link } from 'react-router-dom';
import type { Cast } from '../types';
import { IMAGE_BASE_URL } from '../constants';

interface CastMemberProps {
    member: Cast;
}

const CastMember: React.FC<CastMemberProps> = ({ member }) => {
    const profileUrl = member.profile_path
        ? `${IMAGE_BASE_URL}w185${member.profile_path}`
        : 'https://via.placeholder.com/185x278?text=No+Image';

    return (
        <Link to={`/person/${member.id}`} className="text-center group">
            <div className="rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-transform duration-300">
                <img src={profileUrl} alt={member.name} className="w-full object-cover aspect-[2/3]" />
            </div>
            <h4 className="mt-2 font-semibold text-slate-800 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{member.name}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{member.character}</p>
        </Link>
    );
}

export default CastMember;