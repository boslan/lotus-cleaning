type NoticeType = 'error' | 'success' | 'info' | 'warning';

type Notice = {
    text: string;
    type?: NoticeType;
};
