// GST state codes (label → 2-digit code), as accepted by the dashboard service's billing
// profile (01–38 and 97). The first two digits of a GSTIN are the same code.
export const GST_STATES = [
  { code: '01', label: 'Jammu & Kashmir' },
  { code: '02', label: 'Himachal Pradesh' },
  { code: '03', label: 'Punjab' },
  { code: '04', label: 'Chandigarh' },
  { code: '05', label: 'Uttarakhand' },
  { code: '06', label: 'Haryana' },
  { code: '07', label: 'Delhi' },
  { code: '08', label: 'Rajasthan' },
  { code: '09', label: 'Uttar Pradesh' },
  { code: '10', label: 'Bihar' },
  { code: '11', label: 'Sikkim' },
  { code: '12', label: 'Arunachal Pradesh' },
  { code: '13', label: 'Nagaland' },
  { code: '14', label: 'Manipur' },
  { code: '15', label: 'Mizoram' },
  { code: '16', label: 'Tripura' },
  { code: '17', label: 'Meghalaya' },
  { code: '18', label: 'Assam' },
  { code: '19', label: 'West Bengal' },
  { code: '20', label: 'Jharkhand' },
  { code: '21', label: 'Odisha' },
  { code: '22', label: 'Chhattisgarh' },
  { code: '23', label: 'Madhya Pradesh' },
  { code: '24', label: 'Gujarat' },
  { code: '26', label: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', label: 'Maharashtra' },
  { code: '29', label: 'Karnataka' },
  { code: '30', label: 'Goa' },
  { code: '31', label: 'Lakshadweep' },
  { code: '32', label: 'Kerala' },
  { code: '33', label: 'Tamil Nadu' },
  { code: '34', label: 'Puducherry' },
  { code: '35', label: 'Andaman & Nicobar Islands' },
  { code: '36', label: 'Telangana' },
  { code: '37', label: 'Andhra Pradesh' },
  { code: '38', label: 'Ladakh' },
  { code: '97', label: 'Other Territory' }
];

export function gstStateLabel(code) {
  const state = GST_STATES.find(s => s.code === code);
  return state ? `${state.label} (${code})` : code || '';
}
