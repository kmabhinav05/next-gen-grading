import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportsService } from '../../api/reports';
import { ProgressCard } from '../../components/reports/ProgressCard';
import { Skeleton } from '../../components/common/Skeleton';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentProgressCard = () => {
  const { studentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsService
      .getProgressCard(studentId)
      .then((res) => setData(res))
      .catch((err) => toast.error('Failed to load student progress card'))
      .finally(() => setLoading(false));
  }, [studentId]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="no-print">
        <Link
          to="/staff/class-report"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Class Register</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-4">
          <Skeleton className="h-10 w-2/3 mx-auto" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <ProgressCard data={data} showActions={true} />
      )}
    </div>
  );
};
