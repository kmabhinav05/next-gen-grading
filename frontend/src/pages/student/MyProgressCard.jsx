import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsService } from '../../api/reports';
import { ProgressCard } from '../../components/reports/ProgressCard';
import { Skeleton } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';

export const MyProgressCard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.student?.id) {
      reportsService
        .getProgressCard(user.student.id)
        .then((res) => setData(res))
        .catch(() => toast.error('Failed to load your progress card'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProgressCard data={data} showActions={true} />
    </div>
  );
};
