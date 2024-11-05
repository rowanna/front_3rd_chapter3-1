// import { events } from '../../__mocks__/response/realEvents.json';
import { Event, EventForm } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

const customOverlappingEvt: Event | EventForm = {
  id: '6',
  title: '팀 회의',
  date: '2024-11-20',
  startTime: '10:00',
  endTime: '11:00',
  description: '주간 팀 미팅',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 1,
};
const customNewEvt: Event | EventForm = {
  id: '6',
  title: '팀 회의',
  date: '2024-12-20',
  startTime: '10:00',
  endTime: '11:00',
  description: '주간 팀 미팅',
  location: '회의실 A',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 1,
};
const customMockEvt: Event | EventForm = [
  {
    id: '1',
    title: '팀 회의',
    date: '2024-11-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '2',
    title: '팀 회의',
    date: '2024-11-20',
    startTime: '10:00',
    endTime: '13:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '2',
    title: '팀 회의',
    date: '2024-11-21',
    startTime: '10:00',
    endTime: '13:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2024-07-01', '14:30')).toEqual(new Date('2024-07-01 14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-07-0', '14:30')).toEqual(new Date('2024-07-0 14:30'));
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    expect(parseDateTime('2024-07-01', '14:150')).toEqual(new Date('2024-07-01 14:150'));
    expect(parseDateTime('2024-07-01', '14;00')).toEqual(new Date('2024-07-01 14;00'));
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    expect(parseDateTime('', '14:00')).toEqual(new Date('14:00'));
  });
});

describe('convertEventToDateRange', () => {
  const mockData = customMockEvt[0];

  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const resultData = {
      start: new Date(`${customMockEvt[0].date} ${customMockEvt[0].startTime}`),
      end: new Date(`${customMockEvt[0].date} ${customMockEvt[0].endTime}`),
    };
    expect(convertEventToDateRange(mockData)).toEqual(resultData);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const date = '2024-11-0';
    const startTime = '14:00';
    const endTime = '15:00';
    const resultData = {
      start: new Date(`${date} ${startTime}`),
      end: new Date(`${date} ${endTime}`),
    };

    expect(convertEventToDateRange({ date, startTime, endTime })).toEqual(resultData);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const date = '2024-11-01';
    const startTime = '30:00';
    const endTime = '31:02';
    const resultData = {
      start: new Date(`${date} ${startTime}`),
      end: new Date(`${date} ${endTime}`),
    };

    expect(convertEventToDateRange({ date, startTime, endTime })).toEqual(resultData);
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(customMockEvt[0], customMockEvt[1])).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    expect(isOverlapping(customMockEvt[0], customMockEvt[2])).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    expect(findOverlappingEvents(customOverlappingEvt, customMockEvt)).toHaveLength(2);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    expect(findOverlappingEvents(customNewEvt, customMockEvt)).toHaveLength(0);
  });
});
