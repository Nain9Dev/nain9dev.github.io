// Keyboard rules for the terminal input (spec 033). Tab completes a partial command only;
// otherwise it keeps its normal job of moving focus, so keyboard users are never trapped (WCAG 2.1.2).

export function tabCompletion(value, commands) {
  const typed = value.trim().toLowerCase();
  if (!typed) return null;
  const match = commands.find((command) => command.startsWith(typed));
  return match && match !== typed ? match : null;
}

// While the welcome text is being typed, editing keys are ignored, but Tab still leaves the field.
export function blocksKeyWhileTyping(key) {
  return key !== 'Tab';
}
