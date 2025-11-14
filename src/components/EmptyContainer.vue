<style lang="css">
/* Empty state */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  margin-top: 10px;
}

/* Empty state */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
}

.empty-message {
  text-align: center;
  max-width: 400px;
}

.empty-message i {
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-message h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #484d54;
  margin-bottom: 0.5rem;
}

.empty-message p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.new-service-popup {
  background: #8080801c;
  border-radius: 10px;
}


</style>
<template> 
<div class="empty-container new-service-popup">
        <div class="empty-message">
          <i :class="icon"></i>
          <h3>{{  title }}</h3>
          <!-- <p>{{ searchQuery || statusFilter !== 'all' ?
            "Try adjusting your search or filter criteria." :
            "Get started by creating your first company verification." }}</p> -->
        </div>
      </div>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String
  }
}
</script>