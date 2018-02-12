
export function unnull(v) {
  if (typeof v === 'undefined') {
    return 0;
  }
  return v;
}


export function nulling(v) {
  if (v === 0) {
    return null;
  }

  return v;
}
