export const SUPABASE_TABLES = {
  BUDGETS: 'budgets',
  TASKS: 'tasks',
};

export const BUDGETS_SELECT_COLUMNS = 'id,title,amount,budget_month,created_at';
export const TASKS_SELECT_COLUMNS = 'id,title,notes,due_date,due_time,priority,is_completed,created_at,updated_at';

export const isMissingSupabaseTableError = error => {
  const message = String(error?.message || '').toLowerCase();

  return (
    error?.code === 'PGRST205' ||
    error?.code === '42P01' ||
    message.includes('could not find the table') ||
    message.includes('schema cache') ||
    message.includes('relation "public.budgets" does not exist') ||
    message.includes('relation "public.tasks" does not exist')
  );
};

export const isSupabasePolicyError = error => {
  const message = String(error?.message || '').toLowerCase();

  return (
    error?.code === '42501' ||
    message.includes('row-level security policy') ||
    message.includes('permission denied')
  );
};
