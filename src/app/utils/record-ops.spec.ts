import {nestedObjectPropertyAccessor} from './record-ops'

describe('A nestedObjectPropertyAccessor function', () => {
  it('should access first level of a record', () => {
    const obj = {'a': 1, 'b': 2}
    expect(nestedObjectPropertyAccessor(obj, 'a'))
      .toEqual('1')
  })
  it('should access 2nd level of a record', () => {
    const obj = {'a': 1, 'b': {'aa': 2, 'bb': 3}}
    expect(nestedObjectPropertyAccessor(obj, 'b.aa'))
      .toEqual('2')
  })
  it('should access 3rd level of a record', () => {
    const obj = {'a': 1, 'b': {'aa': {'a': 5, 'c': 4}, 'bb': 3}}
    expect(nestedObjectPropertyAccessor(obj, 'b.aa.a'))
      .toEqual('5')
  })
  it('fail if object can not be converted to a record', () => {
    const obj = 1
    expect(nestedObjectPropertyAccessor(obj, 'b.aa.a'))
      .toEqual('')
  })
  it('fail if property is not found', () => {
    const obj = {'a': 1, 'b': 2}
    expect(nestedObjectPropertyAccessor(obj, ''))
      .toEqual('')
    expect(nestedObjectPropertyAccessor(obj, 'c'))
      .toEqual('')
    expect(nestedObjectPropertyAccessor(obj, 'c.d'))
      .toEqual('')
  })
})

