import { useState, useEffect } from "react";
import { Button, Card, Input, message, Avatar, Space, Popconfirm } from "antd";
import { HeartOutlined, HeartFilled, DislikeOutlined, DeleteOutlined } from "@ant-design/icons";
import { MotionConfig, motion as Motion } from "motion/react";
import api from "../../utils/api";
import useCommentStore from "../../utils/store/commentStore";

const Comments = ({ productId, productType, comments, onCommentsChange }) => {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  
  const { 
    userData, 
    setUserData, 
    setUserInteraction, 
    getUserInteraction,
    clearUserInteraction 
  } = useCommentStore();

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem('user');
      if (userId) {
        try {
          const userResponse = await api.get(`/users/${userId}`);
          setUserData(userResponse.data);
        } catch (err) {
          console.error("Ошибка при загрузке данных пользователя:", err);
        }
      }
    };
    
    loadUserData();
  }, [setUserData]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!productType || !productId) return;
    if (!commentText.trim()) return;
    if (!userData) {
      messageApi.warning("Необходимо войти в систему для добавления комментария");
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        author: userData.name || userData.username || "Пользователь",
        text: commentText.trim(),
        imageUrl: userData.imgUrl,
        userId: userData.id || localStorage.getItem('user')
      };
      const { data } = await api.post(`/comment/${productType}/${productId}`, payload);
      if (data?.success && data?.comment) {
        onCommentsChange(prev => [...prev, data.comment]);
        setCommentText("");
        messageApi.success("Комментарий добавлен");
      }
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      messageApi.error("Ошибка при добавлении комментария");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeDislike = async (commentId, action) => {
    if (!productType || !productId || !commentId) return;
    if (!userData) {
      messageApi.warning("Необходимо войти в систему");
      return;
    }
    
    const currentInteraction = getUserInteraction(commentId);
    
    // If clicking the same action, remove it
    if (currentInteraction === action) {
      clearUserInteraction(commentId);
      onCommentsChange((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likes: action === "like" ? Math.max(0, (c.likes || 0) - 1) : c.likes || 0,
                dislikes: action === "dislike" ? Math.max(0, (c.dislikes || 0) - 1) : c.dislikes || 0,
              }
            : c
        )
      );
      
      // Make backend request to remove like/dislike
      try {
        await api.post(`/comment/${productType}/${productId}/${commentId}/${action === 'like' ? 'dislike' : 'like'}`);
      } catch (error) {
        console.error(`Ошибка при удалении ${action}:`, error);
      }
      return;
    }
    
    // If switching from like to dislike or vice versa
    const wasLiked = currentInteraction === "like";
    const wasDisliked = currentInteraction === "dislike";
    
    setUserInteraction(commentId, action);
    
    onCommentsChange((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              likes: action === "like" 
                ? (c.likes || 0) + 1 
                : wasLiked 
                  ? Math.max(0, (c.likes || 0) - 1) 
                  : c.likes || 0,
              dislikes: action === "dislike" 
                ? (c.dislikes || 0) + 1 
                : wasDisliked 
                  ? Math.max(0, (c.dislikes || 0) - 1) 
                  : c.dislikes || 0,
            }
          : c
      )
    );

    // Make backend request
    try {
      await api.post(`/comment/${productType}/${productId}/${commentId}/${action}`);
    } catch (error) {
      console.error(`Ошибка при ${action} комментария:`, error);
      messageApi.error(`Ошибка при ${action === 'like' ? 'лайке' : 'дизлайке'}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!productType || !productId || !commentId) return;
    if (!userData) return;
    
    try {
      await api.delete(`/comment/${productType}/${productId}/${commentId}`);
      onCommentsChange((prev) => prev.filter(c => c.id !== commentId));
      clearUserInteraction(commentId);
      messageApi.success("Комментарий удален");
    } catch (error) {
      console.error("Ошибка при удалении комментария:", error);
      messageApi.error("Ошибка при удалении комментария");
    }
  };

  return (
    <Motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[92%] mx-auto mt-10 flex flex-col gap-6 px-4 md:px-6"
    >
      {contextHolder}
      <h2 className="text-2xl md:text-3xl font-Arial !font-semibold border-b border-b-[#7a7a7a] py-4 md:py-6">
        Комментарии
      </h2>

      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mb-6">
          <form onSubmit={handleSubmitComment} className="flex flex-col gap-4">
            <Input.TextArea
              placeholder="Ваш комментарий"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              maxLength={500}
              showCount
              disabled={!userData}
            />
            <div className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={!commentText.trim() || !userData}
                size="large"
              >
                {submitting ? "Отправка..." : "Добавить комментарий"}
              </Button>
            </div>
          </form>
        </Card>
      </Motion.div>

      <div className="flex flex-col gap-4">
        {comments?.length ? (
          comments.map((c, index) => {
            const currentUserId = userData?.id || localStorage.getItem('user');
            const isOwnComment = c.userId == currentUserId;
            const userInteraction = getUserInteraction(c.id);
            
            return (
              <Motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className="hover:shadow-md transition-shadow duration-200"
                  actions={[
                    <Space key="actions">
                      <Button
                        type={userInteraction === "like" ? "primary" : "default"}
                        icon={userInteraction === "like" ? <HeartFilled /> : <HeartOutlined />}
                        onClick={() => handleLikeDislike(c.id, "like")}
                        disabled={!userData}
                        size="small"
                      >
                        {c.likes || 0}
                      </Button>
                      <Button
                        type={userInteraction === "dislike" ? "primary" : "default"}
                        icon={<DislikeOutlined />}
                        onClick={() => handleLikeDislike(c.id, "dislike")}
                        disabled={!userData}
                        size="small"
                      >
                        {c.dislikes || 0}
                      </Button>
                      {isOwnComment && (
                        <Popconfirm
                          title="Удалить комментарий?"
                          description="Это действие нельзя отменить"
                          onConfirm={() => handleDeleteComment(c.id)}
                          okText="Да"
                          cancelText="Нет"
                        >
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                          />
                        </Popconfirm>
                      )}
                    </Space>
                  ]}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        src={c.imageUrl}
                        size={48}
                        className="flex-shrink-0"
                      >
                        {c.author?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800">
                          {c.author || "Аноним"}
                        </span>
                        {c.timestamp && (
                          <span className="text-sm text-gray-500">
                            {new Date(c.timestamp).toLocaleString()}
                          </span>
                        )}
                      </div>
                    }
                    description={
                      <div className="text-[15px] md:text-base text-gray-700 mt-2">
                        {c.text}
                      </div>
                    }
                  />
                </Card>
              </Motion.div>
            );
          })
        ) : (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8 text-gray-500"
          >
            Будьте первым, кто оставит комментарий.
          </Motion.div>
        )}
      </div>
    </Motion.div>
  );
};

export default Comments;
