function n(t,s){if(!t||!s)return{};const a=t.tasks?.find(e=>e.taskId===s);return a?{task:a,tasks:[a],lastUpdatedAt:t.lastUpdatedAt||""}:{}}module.exports={createTaskUpdatePayload:n};
