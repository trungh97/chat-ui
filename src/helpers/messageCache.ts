/**
 * Whether an Apollo `storeFieldName` such as
 * `getMessagesByConversationId({"conversationId":"c1","options":{"limit":20}})` is the first page
 * (no cursor) of a conversation's message list, which is the page the chat window displays.
 */
export const isFirstMessagePageOf = (
  storeFieldName: string,
  conversationId: string,
): boolean => {
  const argsStart = storeFieldName.indexOf('(')
  if (argsStart === -1 || !storeFieldName.endsWith(')')) return false

  try {
    const args: {
      conversationId?: string
      options?: { cursor?: string | null }
    } = JSON.parse(storeFieldName.slice(argsStart + 1, -1))

    return args.conversationId === conversationId && !args.options?.cursor
  } catch {
    return false
  }
}
