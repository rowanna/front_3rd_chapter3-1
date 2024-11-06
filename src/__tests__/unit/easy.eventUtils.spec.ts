import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  // 테스트용 mock 이벤트 데이터
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '첫 번째 이벤트 설명',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-06',
      startTime: '14:00',
      endTime: '15:00',
      description: '두 번째 이벤트 설명',
      location: '이벤트 2 장소',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: 'meeting',
      date: '2024-07-31',
      startTime: '11:00',
      endTime: '12:00',
      description: '이벤트 2 관련 미팅', // 검색어 포함
      location: '회의실 C',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '4',
      title: 'meeting',
      date: '2024-08-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '이벤트 2 관련 미팅', // 검색어 포함
      location: '회의실 C',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const currentDate = new Date('2024-07-06');

    const monthResults = getFilteredEvents(mockEvents, '이벤트 2', currentDate, 'month');
    expect(monthResults).toHaveLength(2);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const monthResults = getFilteredEvents(mockEvents, '', new Date('2024-07-01'), 'week');
    expect(monthResults).toHaveLength(2);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const monthResults = getFilteredEvents(mockEvents, '이벤트', new Date('2024-07-01'), 'month');
    expect(monthResults).toHaveLength(3);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const monthResults = getFilteredEvents(mockEvents, '이벤트', new Date('2024-07-01'), 'week');
    expect(monthResults).toHaveLength(2);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const monthResults = getFilteredEvents(mockEvents, '', new Date('2024-07-31'), 'month');
    expect(monthResults).toHaveLength(3);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const monthResults = getFilteredEvents(mockEvents, 'MEETING', new Date('2024-07-31'), 'month');
    expect(monthResults).toHaveLength(1);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const monthResults = getFilteredEvents(mockEvents, '', new Date('2024-07-31'), 'month');
    expect(monthResults).toHaveLength(3);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const monthResults = getFilteredEvents([], '', new Date('2024-07-01'), 'month');
    expect(monthResults).toHaveLength(0);
  });
});
