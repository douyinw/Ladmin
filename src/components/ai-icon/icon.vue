<template>
  <!-- 图标选择 -->
  <a-input v-model="inputValue" :placeholder="`请选择或输入图标`" allow-clear @input="input">
    <template #append>
      <component v-if="inputValue?.length" :is="inputValue" />
      <a-button type="text" style="padding: 0 0 0 8px;" @click="open">选择图标</a-button>
    </template>
  </a-input>

  <a-modal v-model:visible="visible" title="选择图标" width="650px" :footer="false" :mask-closable="true">
    <a-tabs v-model:activeKey="activeKey" type="card" tab-position="left">
      <a-tab-pane v-for="tab in TAGS" :key="tab.key" :title="tab.name">
        <div class="icon-grid">
          <div v-for="icon in getIcons(tab.key)" :key="icon.icon"
            :class="['icon-item', { 'icon-selected': inputValue === icon.icon }]" @click="handleSelect(icon)">
            <div class="icon-cell">
              <component :is="icon.icon" class="icon-display" />
            </div>
            <div class="icon-name">{{ icon.name }}</div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue'

const emits = defineEmits(['update:modelValue', 'input'])
const props = defineProps({
  modelValue: String,
});

const visible = ref(false);
const activeKey = ref(null);
const inputValue = ref(props.modelValue)

const TAGS = [
  { key: 'direction', name: '方向指示类' },
  { key: 'alert', name: '提示建议类' },
  { key: 'interaction', name: '交互按钮类' },
  { key: 'edit', name: '编辑类' },
  { key: 'media', name: '影音类' },
  { key: 'trademark', name: '商标类' },
  { key: 'general', name: '通用类' }
]

const iconData = {
  direction: [
    { id: 'arrow-down', name: '向下', icon: 'IconArrowDown' },
    { id: 'arrow-fall', name: '向下斜', icon: 'IconArrowFall' },
    { id: 'arrow-left', name: '向左', icon: 'IconArrowLeft' },
    { id: 'arrow-right', name: '向右', icon: 'IconArrowRight' },
    { id: 'arrow-rise', name: '向上斜', icon: 'IconArrowRise' },
    { id: 'arrow-up', name: '向上', icon: 'IconArrowUp' },
    { id: 'caret-down', name: '三角下', icon: 'IconCaretDown' },
    { id: 'caret-left', name: '三角左', icon: 'IconCaretLeft' },
    { id: 'caret-right', name: '三角右', icon: 'IconCaretRight' },
    { id: 'caret-up', name: '三角上', icon: 'IconCaretUp' },
    { id: 'double-down', name: '双下', icon: 'IconDoubleDown' },
    { id: 'double-left', name: '双左', icon: 'IconDoubleLeft' },
    { id: 'double-right', name: '双右', icon: 'IconDoubleRight' },
    { id: 'double-up', name: '双上', icon: 'IconDoubleUp' },
    { id: 'down-circle', name: '圆圈下', icon: 'IconDownCircle' },
    { id: 'down', name: '下', icon: 'IconDown' },
    { id: 'drag-arrow', name: '拖拽箭头', icon: 'IconDragArrow' },
    { id: 'expand', name: '展开', icon: 'IconExpand' },
    { id: 'left-circle', name: '圆圈左', icon: 'IconLeftCircle' },
    { id: 'left', name: '左', icon: 'IconLeft' },
    { id: 'menu-fold', name: '菜单折叠', icon: 'IconMenuFold' },
    { id: 'menu-unfold', name: '菜单展开', icon: 'IconMenuUnfold' },
    { id: 'right-circle', name: '圆圈右', icon: 'IconRightCircle' },
    { id: 'right', name: '右', icon: 'IconRight' },
    { id: 'rotate-left', name: '左旋转', icon: 'IconRotateLeft' },
    { id: 'rotate-right', name: '右旋转', icon: 'IconRotateRight' },
    { id: 'shrink', name: '收缩', icon: 'IconShrink' },
    { id: 'swap', name: '交换', icon: 'IconSwap' },
    { id: 'to-bottom', name: '到底部', icon: 'IconToBottom' },
    { id: 'to-left', name: '到左侧', icon: 'IconToLeft' },
    { id: 'to-right', name: '到右侧', icon: 'IconToRight' },
    { id: 'to-top', name: '到顶部', icon: 'IconToTop' },
    { id: 'up-circle', name: '圆圈上', icon: 'IconUpCircle' },
    { id: 'up', name: '上', icon: 'IconUp' }
  ],
  alert: [
    { id: 'check-circle-fill', name: '成功填充', icon: 'IconCheckCircleFill' },
    { id: 'close-circle-fill', name: '关闭填充', icon: 'IconCloseCircleFill' },
    { id: 'exclamation-circle-fill', name: '警告填充', icon: 'IconExclamationCircleFill' },
    { id: 'exclamation-polygon-fill', name: '警告多边形', icon: 'IconExclamationPolygonFill' },
    { id: 'info-circle-fill', name: '信息填充', icon: 'IconInfoCircleFill' },
    { id: 'minus-circle-fill', name: '减号填充', icon: 'IconMinusCircleFill' },
    { id: 'plus-circle-fill', name: '加号填充', icon: 'IconPlusCircleFill' },
    { id: 'question-circle-fill', name: '问号填充', icon: 'IconQuestionCircleFill' },
    { id: 'check-circle', name: '成功', icon: 'IconCheckCircle' },
    { id: 'check-square', name: '勾选', icon: 'IconCheckSquare' },
    { id: 'check', name: '确认', icon: 'IconCheck' },
    { id: 'clock-circle', name: '时钟', icon: 'IconClockCircle' },
    { id: 'close-circle', name: '关闭', icon: 'IconCloseCircle' },
    { id: 'close', name: '关闭', icon: 'IconClose' },
    { id: 'exclamation-circle', name: '警告', icon: 'IconExclamationCircle' },
    { id: 'exclamation', name: '感叹号', icon: 'IconExclamation' },
    { id: 'info-circle', name: '信息', icon: 'IconInfoCircle' },
    { id: 'info', name: '信息', icon: 'IconInfo' },
    { id: 'minus-circle', name: '减号', icon: 'IconMinusCircle' },
    { id: 'minus', name: '减号', icon: 'IconMinus' },
    { id: 'plus-circle', name: '加号', icon: 'IconPlusCircle' },
    { id: 'plus', name: '加号', icon: 'IconPlus' },
    { id: 'question-circle', name: '问号', icon: 'IconQuestionCircle' },
    { id: 'question', name: '问号', icon: 'IconQuestion' },
    { id: 'stop', name: '停止', icon: 'IconStop' }
  ],
  interaction: [
    { id: 'heart-fill', name: '心填充', icon: 'IconHeartFill' },
    { id: 'star-fill', name: '星填充', icon: 'IconStarFill' },
    { id: 'thumb-down-fill', name: '踩填充', icon: 'IconThumbDownFill' },
    { id: 'thumb-up-fill', name: '赞填充', icon: 'IconThumbUpFill' },
    { id: 'at', name: '@', icon: 'IconAt' },
    { id: 'cloud-download', name: '云下载', icon: 'IconCloudDownload' },
    { id: 'code-block', name: '代码块', icon: 'IconCodeBlock' },
    { id: 'code-square', name: '代码方块', icon: 'IconCodeSquare' },
    { id: 'code', name: '代码', icon: 'IconCode' },
    { id: 'customer-service', name: '客服', icon: 'IconCustomerService' },
    { id: 'download', name: '下载', icon: 'IconDownload' },
    { id: 'export', name: '导出', icon: 'IconExport' },
    { id: 'eye-invisible', name: '不可见', icon: 'IconEyeInvisible' },
    { id: 'eye', name: '可见', icon: 'IconEye' },
    { id: 'heart', name: '心', icon: 'IconHeart' },
    { id: 'history', name: '历史', icon: 'IconHistory' },
    { id: 'home', name: '首页', icon: 'IconHome' },
    { id: 'import', name: '导入', icon: 'IconImport' },
    { id: 'launch', name: '启动', icon: 'IconLaunch' },
    { id: 'list', name: '列表', icon: 'IconList' },
    { id: 'message-banned', name: '禁用消息', icon: 'IconMessageBanned' },
    { id: 'message', name: '消息', icon: 'IconMessage' },
    { id: 'more-vertical', name: '更多(竖)', icon: 'IconMoreVertical' },
    { id: 'more', name: '更多', icon: 'IconMore' },
    { id: 'poweroff', name: '电源', icon: 'IconPoweroff' },
    { id: 'refresh', name: '刷新', icon: 'IconRefresh' },
    { id: 'reply', name: '回复', icon: 'IconReply' },
    { id: 'save', name: '保存', icon: 'IconSave' },
    { id: 'scan', name: '扫描', icon: 'IconScan' },
    { id: 'search', name: '搜索', icon: 'IconSearch' },
    { id: 'select-all', name: '全选', icon: 'IconSelectAll' },
    { id: 'send', name: '发送', icon: 'IconSend' },
    { id: 'settings', name: '设置', icon: 'IconSettings' },
    { id: 'share-alt', name: '分享', icon: 'IconShareAlt' },
    { id: 'share-external', name: '外部分享', icon: 'IconShareExternal' },
    { id: 'share-internal', name: '内部分享', icon: 'IconShareInternal' },
    { id: 'star', name: '星星', icon: 'IconStar' },
    { id: 'sync', name: '同步', icon: 'IconSync' },
    { id: 'thumb-down', name: '踩', icon: 'IconThumbDown' },
    { id: 'thumb-up', name: '赞', icon: 'IconThumbUp' },
    { id: 'translate', name: '翻译', icon: 'IconTranslate' },
    { id: 'upload', name: '上传', icon: 'IconUpload' },
    { id: 'voice', name: '语音', icon: 'IconVoice' }
  ],
  edit: [
    { id: 'align-center', name: '居中', icon: 'IconAlignCenter' },
    { id: 'align-left', name: '左对齐', icon: 'IconAlignLeft' },
    { id: 'align-right', name: '右对齐', icon: 'IconAlignRight' },
    { id: 'attachment', name: '附件', icon: 'IconAttachment' },
    { id: 'bg-colors', name: '背景色', icon: 'IconBgColors' },
    { id: 'bold', name: '加粗', icon: 'IconBold' },
    { id: 'brush', name: '画笔', icon: 'IconBrush' },
    { id: 'copy', name: '复制', icon: 'IconCopy' },
    { id: 'delete', name: '删除', icon: 'IconDelete' },
    { id: 'edit', name: '编辑', icon: 'IconEdit' },
    { id: 'eraser', name: '橡皮擦', icon: 'IconEraser' },
    { id: 'filter', name: '筛选', icon: 'IconFilter' },
    { id: 'find-replace', name: '查找替换', icon: 'IconFindReplace' },
    { id: 'font-colors', name: '字体颜色', icon: 'IconFontColors' },
    { id: 'formula', name: '公式', icon: 'IconFormula' },
    { id: 'h1', name: '标题1', icon: 'IconH1' },
    { id: 'h2', name: '标题2', icon: 'IconH2' },
    { id: 'h3', name: '标题3', icon: 'IconH3' },
    { id: 'h4', name: '标题4', icon: 'IconH4' },
    { id: 'h5', name: '标题5', icon: 'IconH5' },
    { id: 'h6', name: '标题6', icon: 'IconH6' },
    { id: 'h7', name: '标题7', icon: 'IconH7' },
    { id: 'highlight', name: '高亮', icon: 'IconHighlight' },
    { id: 'italic', name: '斜体', icon: 'IconItalic' },
    { id: 'line-height', name: '行高', icon: 'IconLineHeight' },
    { id: 'link', name: '链接', icon: 'IconLink' },
    { id: 'oblique-line', name: '斜线', icon: 'IconObliqueLine' },
    { id: 'ordered-list', name: '有序列表', icon: 'IconOrderedList' },
    { id: 'original-size', name: '原始尺寸', icon: 'IconOriginalSize' },
    { id: 'paste', name: '粘贴', icon: 'IconPaste' },
    { id: 'quote', name: '引用', icon: 'IconQuote' },
    { id: 'redo', name: '重做', icon: 'IconRedo' },
    { id: 'scissor', name: '剪刀', icon: 'IconScissor' },
    { id: 'sort-ascending', name: '升序', icon: 'IconSortAscending' },
    { id: 'sort-descending', name: '降序', icon: 'IconSortDescending' },
    { id: 'sort', name: '排序', icon: 'IconSort' },
    { id: 'strikethrough', name: '删除线', icon: 'IconStrikethrough' },
    { id: 'underline', name: '下划线', icon: 'IconUnderline' },
    { id: 'undo', name: '撤销', icon: 'IconUndo' },
    { id: 'unordered-list', name: '无序列表', icon: 'IconUnorderedList' },
    { id: 'zoom-in', name: '放大', icon: 'IconZoomIn' },
    { id: 'zoom-out', name: '缩小', icon: 'IconZoomOut' }
  ],
  media: [
    { id: 'mute-fill', name: '静音填充', icon: 'IconMuteFill' },
    { id: 'pause-circle-fill', name: '暂停填充', icon: 'IconPauseCircleFill' },
    { id: 'play-arrow-fill', name: '播放填充', icon: 'IconPlayArrowFill' },
    { id: 'play-circle-fill', name: '播放圆填充', icon: 'IconPlayCircleFill' },
    { id: 'skip-next-fill', name: '下一曲填充', icon: 'IconSkipNextFill' },
    { id: 'skip-previous-fill', name: '上一曲填充', icon: 'IconSkipPreviousFill' },
    { id: 'sound-fill', name: '声音填充', icon: 'IconSoundFill' },
    { id: 'backward', name: '后退', icon: 'IconBackward' },
    { id: 'forward', name: '前进', icon: 'IconForward' },
    { id: 'fullscreen-exit', name: '退出全屏', icon: 'IconFullscreenExit' },
    { id: 'fullscreen', name: '全屏', icon: 'IconFullscreen' },
    { id: 'live-broadcast', name: '直播', icon: 'IconLiveBroadcast' },
    { id: 'music', name: '音乐', icon: 'IconMusic' },
    { id: 'mute', name: '静音', icon: 'IconMute' },
    { id: 'pause-circle', name: '暂停圆', icon: 'IconPauseCircle' },
    { id: 'pause', name: '暂停', icon: 'IconPause' },
    { id: 'play-arrow', name: '播放', icon: 'IconPlayArrow' },
    { id: 'play-circle', name: '播放圆', icon: 'IconPlayCircle' },
    { id: 'record-stop', name: '停止录音', icon: 'IconRecordStop' },
    { id: 'record', name: '录音', icon: 'IconRecord' },
    { id: 'skip-next', name: '下一曲', icon: 'IconSkipNext' },
    { id: 'skip-previous', name: '上一曲', icon: 'IconSkipPrevious' },
    { id: 'sound', name: '声音', icon: 'IconSound' }
  ],
  trademark: [
    { id: 'bytedance-color', name: '字节跳动', icon: 'IconBytedanceColor' },
    { id: 'lark-color', name: '飞书', icon: 'IconLarkColor' },
    { id: 'tiktok-color', name: '抖音', icon: 'IconTiktokColor' },
    { id: 'xigua-color', name: '西瓜视频', icon: 'IconXiguaColor' },
    { id: 'faceBook-circle-fill', name: 'Facebook圆填充', icon: 'IconFaceBookCircleFill' },
    { id: 'facebook-square-fill', name: 'Facebook方填充', icon: 'IconFacebookSquareFill' },
    { id: 'google-circle-fill', name: '谷歌圆填充', icon: 'IconGoogleCircleFill' },
    { id: 'qq-circle-fill', name: 'QQ圆填充', icon: 'IconQqCircleFill' },
    { id: 'twitter-circle-fill', name: '推特圆填充', icon: 'IconTwitterCircleFill' },
    { id: 'weibo-circle-fill', name: '微博圆填充', icon: 'IconWeiboCircleFill' },
    { id: 'alipay-circle', name: '支付宝圆', icon: 'IconAlipayCircle' },
    { id: 'code-sandbox', name: '代码沙盒', icon: 'IconCodeSandbox' },
    { id: 'codepen', name: 'Codepen', icon: 'IconCodepen' },
    { id: 'facebook', name: 'Facebook', icon: 'IconFacebook' },
    { id: 'github', name: 'GitHub', icon: 'IconGithub' },
    { id: 'gitlab', name: 'GitLab', icon: 'IconGitlab' },
    { id: 'google', name: '谷歌', icon: 'IconGoogle' },
    { id: 'qq-zone', name: 'QQ空间', icon: 'IconQqZone' },
    { id: 'qq', name: 'QQ', icon: 'IconQq' },
    { id: 'twitter', name: '推特', icon: 'IconTwitter' },
    { id: 'wechat', name: '微信', icon: 'IconWechat' },
    { id: 'wechatpay', name: '微信支付', icon: 'IconWechatpay' },
    { id: 'weibo', name: '微博', icon: 'IconWeibo' }
  ],
  general: [
    { id: 'chinese-fill', name: '中文填充', icon: 'IconChineseFill' },
    { id: 'english-fill', name: '英文填充', icon: 'IconEnglishFill' },
    { id: 'face-frown-fill', name: '皱眉填充', icon: 'IconFaceFrownFill' },
    { id: 'face-meh-fill', name: '中性填充', icon: 'IconFaceMehFill' },
    { id: 'face-smile-fill', name: '微笑填充', icon: 'IconFaceSmileFill' },
    { id: 'moon-fill', name: '月亮填充', icon: 'IconMoonFill' },
    { id: 'pen-fill', name: '笔填充', icon: 'IconPenFill' },
    { id: 'sun-fill', name: '太阳填充', icon: 'IconSunFill' },
    { id: 'apps', name: '应用', icon: 'IconApps' },
    { id: 'archive', name: '存档', icon: 'IconArchive' },
    { id: 'bar-chart', name: '柱状图', icon: 'IconBarChart' },
    { id: 'book', name: '书', icon: 'IconBook' },
    { id: 'bookmark', name: '书签', icon: 'IconBookmark' },
    { id: 'branch', name: '分支', icon: 'IconBranch' },
    { id: 'bug', name: 'Bug', icon: 'IconBug' },
    { id: 'bulb', name: '灯泡', icon: 'IconBulb' },
    { id: 'calendar-clock', name: '日历时钟', icon: 'IconCalendarClock' },
    { id: 'calendar', name: '日历', icon: 'IconCalendar' },
    { id: 'camera', name: '相机', icon: 'IconCamera' },
    { id: 'cloud', name: '云', icon: 'IconCloud' },
    { id: 'command', name: '命令', icon: 'IconCommand' },
    { id: 'common', name: '通用', icon: 'IconCommon' },
    { id: 'compass', name: '指南针', icon: 'IconCompass' },
    { id: 'computer', name: '电脑', icon: 'IconComputer' },
    { id: 'copyright', name: '版权', icon: 'IconCopyright' },
    { id: 'dashboard', name: '仪表盘', icon: 'IconDashboard' },
    { id: 'desktop', name: '桌面', icon: 'IconDesktop' },
    { id: 'dice', name: '骰子', icon: 'IconDice' },
    { id: 'drag-dot-vertical', name: '垂直拖拽点', icon: 'IconDragDotVertical' },
    { id: 'drag-dot', name: '拖拽点', icon: 'IconDragDot' },
    { id: 'drive-file', name: '驱动文件', icon: 'IconDriveFile' },
    { id: 'ear', name: '耳朵', icon: 'IconEar' },
    { id: 'email', name: '邮箱', icon: 'IconEmail' },
    { id: 'empty', name: '空', icon: 'IconEmpty' },
    { id: 'experiment', name: '实验', icon: 'IconExperiment' },
    { id: 'file-audio', name: '音频文件', icon: 'IconFileAudio' },
    { id: 'file-image', name: '图片文件', icon: 'IconFileImage' },
    { id: 'file-pdf', name: 'PDF文件', icon: 'IconFilePdf' },
    { id: 'file-video', name: '视频文件', icon: 'IconFileVideo' },
    { id: 'file', name: '文件', icon: 'IconFile' },
    { id: 'fire', name: '火', icon: 'IconFire' },
    { id: 'folder-add', name: '添加文件夹', icon: 'IconFolderAdd' },
    { id: 'folder-delete', name: '删除文件夹', icon: 'IconFolderDelete' },
    { id: 'folder', name: '文件夹', icon: 'IconFolder' },
    { id: 'gift', name: '礼物', icon: 'IconGift' },
    { id: 'idcard', name: '身份证', icon: 'IconIdcard' },
    { id: 'image-close', name: '关闭图片', icon: 'IconImageClose' },
    { id: 'image', name: '图片', icon: 'IconImage' },
    { id: 'interaction', name: '交互', icon: 'IconInteraction' },
    { id: 'language', name: '语言', icon: 'IconLanguage' },
    { id: 'layers', name: '图层', icon: 'IconLayers' },
    { id: 'layout', name: '布局', icon: 'IconLayout' },
    { id: 'loading', name: '加载', icon: 'IconLoading' },
    { id: 'location', name: '位置', icon: 'IconLocation' },
    { id: 'lock', name: '锁定', icon: 'IconLock' },
    { id: 'loop', name: '循环', icon: 'IconLoop' },
    { id: 'man', name: '男性', icon: 'IconMan' },
    { id: 'menu', name: '菜单', icon: 'IconMenu' },
    { id: 'mind-mapping', name: '思维导图', icon: 'IconMindMapping' },
    { id: 'mobile', name: '手机', icon: 'IconMobile' },
    { id: 'moon', name: '月亮', icon: 'IconMoon' },
    { id: 'mosaic', name: '马赛克', icon: 'IconMosaic' },
    { id: 'nav', name: '导航', icon: 'IconNav' },
    { id: 'notification-close', name: '关闭通知', icon: 'IconNotificationClose' },
    { id: 'notification', name: '通知', icon: 'IconNotification' },
    { id: 'palette', name: '调色板', icon: 'IconPalette' },
    { id: 'pen', name: '笔', icon: 'IconPen' },
    { id: 'phone', name: '电话', icon: 'IconPhone' },
    { id: 'printer', name: '打印机', icon: 'IconPrinter' },
    { id: 'public', name: '公共', icon: 'IconPublic' },
    { id: 'pushpin', name: '图钉', icon: 'IconPushpin' },
    { id: 'qrcode', name: '二维码', icon: 'IconQrcode' },
    { id: 'relation', name: '关系', icon: 'IconRelation' },
    { id: 'robot-add', name: '添加机器人', icon: 'IconRobotAdd' },
    { id: 'robot', name: '机器人', icon: 'IconRobot' },
    { id: 'safe', name: '保险箱', icon: 'IconSafe' },
    { id: 'schedule', name: '日程', icon: 'IconSchedule' },
    { id: 'shake', name: '摇动', icon: 'IconShake' },
    { id: 'skin', name: '皮肤', icon: 'IconSkin' },
    { id: 'stamp', name: '印章', icon: 'IconStamp' },
    { id: 'storage', name: '存储', icon: 'IconStorage' },
    { id: 'subscribe-add', name: '添加订阅', icon: 'IconSubscribeAdd' },
    { id: 'subscribe', name: '订阅', icon: 'IconSubscribe' },
    { id: 'subscribed', name: '已订阅', icon: 'IconSubscribed' },
    { id: 'sun', name: '太阳', icon: 'IconSun' },
    { id: 'tag', name: '标签', icon: 'IconTag' },
    { id: 'tags', name: '标签组', icon: 'IconTags' },
    { id: 'thunderbolt', name: '闪电', icon: 'IconThunderbolt' },
    { id: 'tool', name: '工具', icon: 'IconTool' },
    { id: 'trophy', name: '奖杯', icon: 'IconTrophy' },
    { id: 'unlock', name: '解锁', icon: 'IconUnlock' },
    { id: 'user-add', name: '添加用户', icon: 'IconUserAdd' },
    { id: 'user-group', name: '用户组', icon: 'IconUserGroup' },
    { id: 'user', name: '用户', icon: 'IconUser' },
    { id: 'video-camera', name: '摄像机', icon: 'IconVideoCamera' },
    { id: 'wifi', name: 'WiFi', icon: 'IconWifi' },
    { id: 'woman', name: '女性', icon: 'IconWoman' }
  ]
}

const searchText = {}
Object.keys(iconData).forEach(key => {
  iconData[key].forEach(m => {
    searchText[m.icon] = key
  })
})

watch(() => props.modelValue, (val) => {
  inputValue.value = val
})

const getIcons = (key) => {
  return iconData[key] ?? []
}

const open = () => {
  visible.value = true;
  const val = inputValue.value
  if (val && searchText[val]) {
    activeKey.value = searchText[val]
  }
}

const input = (val) => {
  emits('input', val)
  emits('update:modelValue', val)
}

const handleSelect = ({ icon }) => {
  visible.value = false
  inputValue.value = icon
  input(icon)
}

</script>

<style lang="scss" scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  padding: 8px;
}

.icon-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--color-neutral-3);
  color: var(--color-text-2);
  position: relative;
  box-sizing: border-box;
  overflow: hidden;

  &:hover {
    border-color: rgb(var(--primary-6));
    transform: translateY(-2px);
  }

  &.icon-selected {
    border-color: rgb(var(--primary-6));

    &::after {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      background: rgb(var(--primary-6));
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
  }
}

.icon-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 22px;
  margin-bottom: 8px;
  color: inherit;
}

.icon-name {
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
  word-break: break-all;
  color: var(--color-text-1);
}

.icon-category {
  font-size: 16px;
  color: var(--color-text-2);
}
</style>