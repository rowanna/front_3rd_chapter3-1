import { events } from '../../__mocks__/response/realEvents.json';
import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const baseEvent: Event[] = events;
  const notifiedEvents = [baseEvent[0].id];

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const upComingEvt = getUpcomingEvents(baseEvent, new Date('2024-11-20T09:59:00'), []);
    expect(upComingEvt).toHaveLength(1);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const upComingEvt = getUpcomingEvents(
      baseEvent,
      new Date('2024-11-20T10:59:00'),
      notifiedEvents
    );

    expect(upComingEvt).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const upComingEvt = getUpcomingEvents(
      baseEvent,
      new Date('2024-11-20T09:00:00'),
      notifiedEvents
    );
    expect(upComingEvt).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const upComingEvt = getUpcomingEvents(
      baseEvent,
      new Date('2024-11-20T10:59:00'),
      notifiedEvents
    );

    expect(upComingEvt).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  const event: Event = events[0];
  it('올바른 알림 메시지를 생성해야 한다', () => {
    expect(createNotificationMessage(event)).toBe('1분 후 팀 회의 일정이 시작됩니다.');
  });
});
