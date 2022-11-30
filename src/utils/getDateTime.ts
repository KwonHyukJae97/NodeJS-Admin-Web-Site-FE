import moment from 'moment/moment';

// 한국 시간으로 변경하는 메서드
export const getDateTime = (utcTime: Date) => {
  const kstTime = moment(utcTime).toDate();
  kstTime.setHours(kstTime.getHours() + 9);

  // yyyy-mm-dd 형식으로 반환
  return kstTime.toISOString().replace('T', ' ').substring(0, 11);
};
