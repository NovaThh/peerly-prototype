export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELED'
  | 'COMPLETED';

export type Request = {
  id: string;
  requester_id: string;
  receiver_id: string;
  subject: string;
  scheduled_datetime: string;
  status: RequestStatus;
  created_at: string;
};

export const MOCK_REQUESTS: Request[] = [
  // Active (ACCEPTED)
  {
    id: 'r1',
    requester_id: '1',
    receiver_id: '2',
    subject: 'Math',
    scheduled_datetime: '2026-03-10T10:00:00Z',
    status: 'ACCEPTED',
    created_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'r2',
    requester_id: '3',
    receiver_id: '1',
    subject: 'Coding',
    scheduled_datetime: '2026-03-12T14:00:00Z',
    status: 'ACCEPTED',
    created_at: '2026-02-03T10:00:00Z',
  },

  // In Progress (Pending / Declined / Canceled)
  {
    id: 'r3',
    requester_id: '1',
    receiver_id: '4',
    subject: 'Advanced Data Structure',
    scheduled_datetime: '2026-03-15T09:00:00Z',
    status: 'PENDING',
    created_at: '2026-02-05T10:00:00Z',
  },
  {
    id: 'r4',
    requester_id: '5',
    receiver_id: '1',
    subject: 'Math',
    scheduled_datetime: '2026-03-16T09:00:00Z',
    status: 'CANCELED',
    created_at: '2026-02-06T10:00:00Z',
  },
  {
    id: 'r5',
    requester_id: '2',
    receiver_id: '1',
    subject: 'Parallel Computing',
    scheduled_datetime: '2026-03-18T09:00:00Z',
    status: 'DECLINED',
    created_at: '2026-02-07T10:00:00Z',
  },

  // Incoming (PENDING where I am receiver)
  {
    id: 'r6',
    requester_id: '4',
    receiver_id: '1',
    subject: 'Physics',
    scheduled_datetime: '2026-03-20T09:00:00Z',
    status: 'PENDING',
    created_at: '2026-02-08T10:00:00Z',
  },

  // Completed
  {
    id: 'r7',
    requester_id: '1',
    receiver_id: '3',
    subject: 'Java Programming',
    scheduled_datetime: '2026-02-20T09:00:00Z',
    status: 'COMPLETED',
    created_at: '2026-01-25T10:00:00Z',
  },
];