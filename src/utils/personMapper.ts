import { ApiPerson } from '../types/api';
import { Person } from '../types/person';

export const mapPersonFromApi = (apiPerson: ApiPerson): Person => ({
  id: String(apiPerson.id),
  name: apiPerson.name,
  age: apiPerson.age,
  location: apiPerson.location,
  pictures: apiPerson.pictures ?? [],
  likesCount: apiPerson.likes_count,
  dislikesCount: apiPerson.dislikes_count,
});

