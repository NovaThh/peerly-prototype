export type RequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELED'
  | 'COMPLETED';

export type RequestType = 'REQUEST' | 'OFFER';

export type Request = {
  id: string;
  requester_id: string;
  receiver_id: string;
  subject: string;
  scheduled_datetime: string;
  status: RequestStatus;
  created_at: string;
  type: RequestType;

  // NEW – per-user completion (prototype simplification)
  requester_completed?: boolean;
  receiver_completed?: boolean;
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
    type: 'REQUEST', // user 1 asked user 2 for help with Math
    requester_completed: false,
    receiver_completed: false,
  },
  {
    id: 'r2',
    requester_id: '3',
    receiver_id: '1',
    subject: 'Coding',
    scheduled_datetime: '2026-03-12T14:00:00Z',
    status: 'ACCEPTED',
    created_at: '2026-02-03T10:00:00Z',
    type: 'OFFER', // user 3 offered to help user 1 with Coding
    requester_completed: false,
    receiver_completed: false,
  },

  // Pending / declined / canceled (mixed)
  {
    id: 'r3',
    requester_id: '1',
    receiver_id: '4',
    subject: 'Advanced Data Structure',
    scheduled_datetime: '2026-03-15T09:00:00Z',
    status: 'PENDING',
    created_at: '2026-02-05T10:00:00Z',
    type: 'OFFER', // you offered to help user 4
    requester_completed: false,
    receiver_completed: false,
  },
  {
    id: 'r10',
    requester_id: '4',
    receiver_id: '1',
    subject: 'Testing subject',
    scheduled_datetime: '2026-03-15T09:00:00Z',
    status: 'DECLINED',
    created_at: '2026-02-05T10:00:00Z',
    type: 'REQUEST',
    requester_completed: false,
    receiver_completed: false,
  },
  {
    id: 'r4',
    requester_id: '5',
    receiver_id: '1',
    subject: 'Math',
    scheduled_datetime: '2026-03-16T09:00:00Z',
    status: 'CANCELED',
    created_at: '2026-02-06T10:00:00Z',
    type: 'REQUEST', // user 5 asked you for help with Math
    requester_completed: false,
    receiver_completed: false,
  },
  {
    id: 'r5',
    requester_id: '2',
    receiver_id: '1',
    subject: 'Parallel Computing',
    scheduled_datetime: '2026-03-18T09:00:00Z',
    status: 'DECLINED',
    created_at: '2026-02-07T10:00:00Z',
    type: 'REQUEST', // user 2 asked you for help
    requester_completed: false,
    receiver_completed: false,
  },

  // Incoming (PENDING where you are receiver)
  {
    id: 'r6',
    requester_id: '4',
    receiver_id: '1',
    subject: 'Physics',
    scheduled_datetime: '2026-03-20T09:00:00Z',
    status: 'PENDING',
    created_at: '2026-02-08T10:00:00Z',
    type: 'REQUEST', // user 4 asks you for help with Physics
    requester_completed: false,
    receiver_completed: false,
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
    type: 'REQUEST', // you asked user 3 for help
    requester_completed: true,
    receiver_completed: true,
  },
];