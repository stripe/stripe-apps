export function withValueFromEvent<
  Element extends { value: string },
  Event extends { target: Element },
  ReturnValue
>(
  callback: (value: Event["target"]["value"]) => ReturnValue
): (event: Event) => ReturnValue {
  return (event) => callback(event.target.value);
}
