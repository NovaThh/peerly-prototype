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

  requester_completed?: boolean;
  receiver_completed?: boolean;
};