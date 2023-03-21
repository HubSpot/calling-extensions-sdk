import { ChangeEvent } from 'react';

type Value = { text: string; value: string };

class SyntheticEventClass {
  target: { value: Value };
  currentTarget: { value: Value };
  source: ChangeEvent<HTMLSelectElement>;
  constructor(value: Value, evt: ChangeEvent<HTMLSelectElement>) {
    const target = {
      value,
    };
    this.target = target;
    this.currentTarget = target;
    this.source = evt;
  }

  preventDefault() {
    if (this.source) {
      this.source.preventDefault();
    }
  }

  stopPropagation() {
    if (this.source) {
      this.source.stopPropagation();
    }
  }
}

function SyntheticEvent(value: Value, evt: ChangeEvent<HTMLSelectElement>) {
  return new SyntheticEventClass(value, evt);
}

SyntheticEvent.constructor = SyntheticEventClass;

export default SyntheticEvent;
