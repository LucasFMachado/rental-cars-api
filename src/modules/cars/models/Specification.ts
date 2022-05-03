import { v4 as uuid } from 'uuid';

class Specification {
  id: string;
  name: string;
  description: string;
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
      this.created_at = new Date();
    }
  }
}

export { Specification };
