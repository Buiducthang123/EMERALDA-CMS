<script lang="ts" setup>
import {
  Alignment,
  Autoformat,
  AutoImage,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock, type Editor,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  MediaEmbedToolbar, 
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  ShowBlocks,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties, TableToolbar, TextTransformation, type ToolbarConfig, Underline, Undo, WordCount, type Writer,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import type {PluginConstructor} from "@ckeditor/ckeditor5-core/src/plugin";

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()
const props = defineProps<{
  value?: string
  toolbar?: ToolbarConfig
  plugins?: Array<PluginConstructor | string>;
  config?: { [key: string]: any }
  overwrite?: {
    [key: string]: boolean
  } | boolean
}>()
const content = ref(props.value)
const plugins = ref((isBoolean(props.overwrite) && props.overwrite) || (isObject(props.overwrite) && props.overwrite['plugins']) ? 
    props.plugins : [
      Alignment,
      AutoImage,
      Autoformat,
      BlockQuote,
      Bold,
      Code,
      CodeBlock,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      Heading,
      Indent,
      IndentBlock,
      Italic,
      Link,
      List,
      ListProperties,
      MediaEmbed,
      MediaEmbedToolbar,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      SelectAll,
      ShowBlocks,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      Underline,
      Undo,
      WordCount,
      ...(props.plugins ?? [])
    ]
)
const toolbar = ref((isBoolean(props.overwrite) && props.overwrite) || (isObject(props.overwrite) && props.overwrite['toolbar']) ? 
    props.toolbar : {
      items: [
        'undo',
        'redo',
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'codeBlock',
        'code',
        '|',
        'fontBackgroundColor',
        'fontSize',
        'fontColor',
        'superscript',
        'subscript',
        'strikethrough',
        'underline',
        '|',
        'outdent',
        'indent',
        'alignment',
        'numberedList',
        'bulletedList',
        '|',
        'mediaEmbed',
        '|',
        'blockQuote',
        'insertTable',
        '|',
        'specialCharacters',
        '|',
        'showBlocks',
        'findAndReplace',
        'removeFormat',
        'selectAll',
        '|', 'strikethrough', 'subscript', 'superscript',         
      ],
      shouldNotGroupWhenFull: true,
      ...props.toolbar
    }
)
const editorConfig = computed(() => (isBoolean(props.overwrite) && props.overwrite) || (isObject(props.overwrite) && props.overwrite['config']) ? 
    props.config : {
      plugins: plugins.value,
      removePlugins: ['MediaEmbedToolbar'],
      toolbar: toolbar.value,
      image: {
        toolbar: [
          'imageTextAlternative',
          'toggleImageCaption',
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side'
        ]
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableCellProperties',
          'tableProperties'
        ]
      },
      htmlSupport: {
        allow: [],
        disallow: []
      },
      ...props.config
    })
const editorInt = ref()

const onReady = (e: Editor) => {
  editorInt.value = e
}
const insertTextAtCursor = (text: string) => {
  editorInt.value.model.change((writer: Writer) => {
    const insertPosition = editorInt.value.model.document.selection.getFirstPosition();
    writer.insertText(text, insertPosition);
  });
}

defineExpose({insertTextAtCursor})
</script>

<template>
  <ckeditor
      :config="editorConfig"
      :editor="ClassicEditor"
      :model-value="content"
      @input="emit('update:value', $event)"
      @ready="onReady"
  ></ckeditor>
</template>

<style scoped>
/* Add your styles here if needed */
</style>