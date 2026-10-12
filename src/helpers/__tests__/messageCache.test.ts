import { isFirstMessagePageOf } from '../messageCache'

describe('isFirstMessagePageOf', () => {
  it('matches the first page of the conversation', () => {
    expect(
      isFirstMessagePageOf(
        'getMessagesByConversationId({"conversationId":"c1","options":{"limit":20}})',
        'c1',
      ),
    ).toBe(true)
  })

  it('does not match another conversation', () => {
    expect(
      isFirstMessagePageOf(
        'getMessagesByConversationId({"conversationId":"c2","options":{"limit":20}})',
        'c1',
      ),
    ).toBe(false)
  })

  it('does not match a later page', () => {
    expect(
      isFirstMessagePageOf(
        'getMessagesByConversationId({"conversationId":"c1","options":{"cursor":"m9","limit":20}})',
        'c1',
      ),
    ).toBe(false)
  })

  it('does not match a field without arguments or with malformed arguments', () => {
    expect(isFirstMessagePageOf('getMessagesByConversationId', 'c1')).toBe(
      false,
    )
    expect(
      isFirstMessagePageOf('getMessagesByConversationId({bad)', 'c1'),
    ).toBe(false)
  })
})
