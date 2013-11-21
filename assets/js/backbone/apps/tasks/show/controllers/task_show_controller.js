// Here I  will attempt to keep all the logic for tags in the controller
// and not in the view layer.  If this works then we can move
// the project view tag methods out to the controller as it should be.

define([
  'bootstrap',
  'underscore',
  'backbone',
  'base_view',
  'comment_list_controller',
  'attachment_show_view',
  'task_item_view',
  'tag_show_view',
  'task_edit_form_view'
], function (Bootstrap, _, Backbone, BaseView, CommentListController, AttachmentView, TaskItemView, TagShowView, TaskEditFormView) {

  var TaskShowController = BaseView.extend({

    el: "#container",

    events: {
      'click .edit-task': 'edit'
    },

    initialize: function (options) {
      this.options = options;

      this.initializeTaskItemView();
      this.initializeChildren();
    },

    initializeChildren: function () {
      var self = this;

      this.listenTo(this.model, 'task:show:render:done', function () {
        if (self.commentListController) self.commentListController.cleanup();
        self.commentListController = new CommentListController({
          target: 'task',
          id: self.model.id
        });

        if (self.tagView) self.tagView.cleanup();
        self.tagView = new TagShowView({
          model: self.model,
          el: '.tag-wrapper',
          target: 'task',
          targetId: 'taskId',
          edit: true,
          url: '/api/tag/findAllByTaskId/'
        }).render();

        if (self.attachmentView) self.attachmentView.cleanup();
        self.attachmentView = new AttachmentView({
          target: 'task',
          id: this.model.attributes.id,
          owner: this.model.attributes.isOwner,
          el: '.attachment-wrapper'
        }).render();
      });
    },

    initializeTaskItemView: function () {
      var self = this;

      if (this.taskItemView) this.taskItemView.cleanup();
      this.taskItemView = new TaskItemView({
        model: self.options.model,
        router: self.options.router,
        id: self.options.id,
        el: self.el
      });
    },

    edit: function (e) {
      if (e.preventDefault) e.preventDefault();
      var self = this;

      if (this.taskEditFormView) this.taskEditFormView.cleanup();
      this.taskEditFormView = new TaskEditFormView({
        el: '.edit-task-section',
        model: self.model
      }).render();
    },

    cleanup: function () {
      if (this.tagView) { this.tagView.cleanup(); }
      if (this.attachmentView) { this.attachmentView.cleanup(); }
      if (this.commentListController) { this.commentListController.cleanup(); }
      if (this.taskItemView) { this.taskItemView.cleanup(); }
      removeView(this);
    }

  });

  return TaskShowController;
})