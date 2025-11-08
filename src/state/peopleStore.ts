import { create } from 'zustand';
import { Person } from '../types/person';

type SwipeDirection = 'left' | 'right';

type PeopleState = {
  people: Person[];
  currentIndex: number;
  likedPeople: Person[];
  passedPeople: Person[];
  setPeople: (people: Person[]) => void;
  recordSwipe: (person: Person, direction: SwipeDirection) => void;
  resetSession: () => void;
};

export const usePeopleStore = create<PeopleState>(set => ({
  people: [],
  currentIndex: 0,
  likedPeople: [],
  passedPeople: [],
  setPeople: people =>
    set(() => ({
      people,
      currentIndex: 0,
      likedPeople: [],
      passedPeople: [],
    })),
  recordSwipe: (person, direction) =>
    set(state => ({
      currentIndex: state.currentIndex + 1,
      likedPeople:
        direction === 'right'
          ? [...state.likedPeople, person]
          : state.likedPeople,
      passedPeople:
        direction === 'left'
          ? [...state.passedPeople, person]
          : state.passedPeople,
    })),
  resetSession: () =>
    set(() => ({
      currentIndex: 0,
      likedPeople: [],
      passedPeople: [],
    })),
}));

