import { getAuthority } from './authority';

describe('getAuthority should be strong', () => {
  it('empty', () => {
    expect(getAuthority(null)).toEqual(['admin']); // default value
  });
  it('string', () => {
    expect(getAuthority('admin')).toEqual(['admin']);
  });
  it('array with double quotes', () => {
    expect(getAuthority('"admin"')).toEqual(['admin']);
  });
  it('array with single item', () => {
    expect(getAuthority('["admin"]')).toEqual(['admin']);
  });
  it('array with multiple items', () => {
    expect(getAuthority('["ROLE_ADMIN", "guest"]')).toEqual(['admin', 'guest']);
  });
});
