<template>
  <div class="pd-wrap">
    <div class="pd-icon-ring">
      <v-icon size="36" color="#b45309">mdi-lock-outline</v-icon>
    </div>
    <div class="pd-title">Access Denied</div>
    <div class="pd-msg">{{ message || 'You don\'t have permission to access this resource.' }}</div>
    <div class="pd-hint">
      <v-icon x-small color="#92400e" class="mr-1">mdi-information-outline</v-icon>
      Contact your administrator to request the required permissions.
    </div>
  </div>
</template>

<script>
export default {
  name: 'PermissionDenied',
  props: {
    message: { type: String, default: '' }
  }
}
</script>

<style scoped>
.pd-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 32px;
  margin: 16px 0;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
}
.pd-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fef3c7;
  border: 2px solid #fcd34d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.pd-title {
  font-size: 18px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 8px;
}
.pd-msg {
  font-size: 13px;
  color: #78350f;
  margin-bottom: 12px;
  max-width: 360px;
  line-height: 1.5;
}
.pd-hint {
  font-size: 12px;
  color: #92400e;
  display: flex;
  align-items: center;
  background: #fef9c3;
  border: 1px solid #fde68a;
  border-radius: 4px;
  padding: 6px 12px;
}
</style>
