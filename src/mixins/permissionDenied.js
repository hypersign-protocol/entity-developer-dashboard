export default {
  data() {
    return {
      accessDenied: false,
      accessDeniedMsg: '',
    };
  },
  methods: {
    handleError(e) {
      const msg = (e?.message || '').toLowerCase();
      const isPermDenied =
        msg.includes('permission denied') ||
        msg.includes('not authorized') ||
        msg.includes('forbidden') ||
        msg.includes('access denied') ||
        msg.includes('unauthorized');

      if (isPermDenied) {
        this.accessDenied = true;
        this.accessDeniedMsg = e.message || 'Permission Denied';
      } else {
        this.notifyErr(e.message || 'An error occurred');
      }
    },
  },
};
