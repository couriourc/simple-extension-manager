<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from "vue-router";
import { extensionStore } from "../store";
import ExtensionList from "../components/ExtensionList.vue";
import { NEmpty, NAvatar } from 'naive-ui';
import { CloudUploadOutline } from "@vicons/ionicons5"

import { Cmd, Extension, Msg, vscode, getExtensionId, Res, ExtensionPackage, extensionsPostResolver, uploadFile } from "../utils";
import {
    provideVSCodeDesignSystem,
    vsCodeButton,
    vsCodeTextField,
    vsCodeBadge,
    vsCodeTag
} from "@vscode/webview-ui-toolkit";
import { ref } from "vue";
import ExtensionFilter from "../components/ExtensionFilter.vue";
provideVSCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeTextField(),
    vsCodeBadge(),
    vsCodeTag()
);
const router = useRouter();
const store = extensionStore();
const fileButton = ref<HTMLElement>();
function back() {
    store.updatePage.currentExtension = new Extension(new ExtensionPackage());
    store.updatePage.isUpdate = false;
    router.replace("/home");
}

function delfromList(item: Extension) {
    store.updatePage.extensionList = store.updatePage.extensionList.filter(e => getExtensionId(e) !== getExtensionId(item))
    store.updatePage.extensionPack.unshift(item)
    extensionsPostResolver(store.updatePage.extensionList)
    extensionsPostResolver(store.updatePage.extensionPack)
}
function delFromPack(item: Extension) {
    store.updatePage.extensionPack = store.updatePage.extensionPack.filter((e: Extension) => getExtensionId(e) !== getExtensionId(item));
    store.updatePage.extensionList.unshift(item);
    extensionsPostResolver(store.updatePage.extensionList)
    extensionsPostResolver(store.updatePage.extensionPack)
}
function create() {
    if (store.currentDiscription === "" || store.currentDisplayName === "") {
        vscode.postMessage(new Msg(Cmd.showErrMsg, "Display Name or Discription can't be empty!"))
        return;
    }
    if (store.updatePage.extensionPack.length === 0) {
        vscode.postMessage(new Msg(Cmd.showErrMsg, "Extension Pack can't be empty!"))
        return;
    }
    store.updatePage.currentExtension.pck.extensionPack = store.updatePage.extensionPack.map(s => getExtensionId(s));
    vscode.postMessage(new Msg(Cmd.createExtensionPack, { extension: store.updatePage.currentExtension, isUpdate: store.updatePage.isUpdate }), (res: string) => {

        if (<Res>JSON.parse(res).success) {
            store.getExtensions();
            router.replace("/home");
            store.updatePage.currentExtension = new Extension();
            store.updatePage.isUpdate = false;
        }
    });
}
// 获取文件 这里是使用的 vue3.0 语法 
function imgResolver(reader: FileReader, file: File) {
    reader.readAsDataURL(file);
    reader.onload = () => {
        store.updatePage.currentExtension.img = <string>reader.result;
    };

}
const extensionList = computed(() => {
    return store.updatePage.extensionList;
})
</script>

<template>
    <input v-show="false" id="file" ref="fileButton" type="file" @change="uploadFile($event, imgResolver)"
        accept="image/*" />

    <div class="outer px-12px">
        <div class="leftWrap">
            <h2 style="text-align: center;">Extension List</h2>
            <ExtensionFilter :extensionList="extensionList"></ExtensionFilter>
            <div class="left">
                <ExtensionList :extensions="extensionList" @itemClick="delfromList" />
            </div>
        </div>
        <div class="middle">
            <div relative flex items-center justify-center rounded-full w-128px h-128px m-auto cursor-pointer @click="fileButton?.click()">
                <n-icon absolute text-18px w-50px z-1 filter-grayscale-10 cursor-pointer text="#999" size="40" :depth="3">
                    <CloudUploadOutline></CloudUploadOutline>
                </n-icon>
                <div bg="#333" rounded-full absolute z-2 w-128px h-128px bg-opacity-20></div>
            </div>
            <div class="info">
                <div class="displayName">
                    <h2 style="line-height: 0;text-align: center;">DisplayName</h2>
                    <input v-model="store.updatePage.currentExtension.pck.displayName" placeholder="input the display name"
                        class="text" type="text" />
                </div>
                <div class="discription">
                    <h2 style="line-height: 0;text-align: center;">Discription</h2>
                    <input placeholder="input the discription" v-model="store.updatePage.currentExtension.pck.description"
                        class="text" type="text" />
                </div>
            </div>
            <div class="buttons">
                <div @click="create">
                    <vscode-button style="width: 80px;height: 40px;">
                        <h3>{{ store.updatePage.isUpdate ? 'Update' : 'Create' }}</h3>
                    </vscode-button>
                </div>
                <div @click="back">
                    <vscode-button appearance="secondary" style="width: 80px;height: 40px;">
                        <h3>Back</h3>
                    </vscode-button>
                </div>
            </div>
        </div>
        <div class="rightWrap">
            <h2 style="text-align: center;">Extension Pack</h2>
            <ExtensionFilter :extensionList="store.updatePage.extensionPack"></ExtensionFilter>
            <div class="right">
                <ExtensionList v-if="store.updatePage.extensionPack.length" :extensions="store.updatePage.extensionPack"
                    @itemClick="delFromPack" />
                <n-empty mt-20px v-else description="Empty!"> </n-empty>
            </div>
        </div>
    </div>
</template>


<style scoped lang="less">
@outerHeight: 100vh;
@outerWidth: 100%;


.alignHorizontal(@height, @width) {
    width: @width;
    height: @height;
    margin: 0 auto;
}

.alignVertical() {
    top: 0;
    bottom: 0;
    margin: auto 0;
}

.outer {
    @boxHeight: 80vh;
    @boxWidth: 350px;
    .alignHorizontal(@outerHeight, @outerWidth);

    display: flex;


    .box() {
        height: @boxHeight;
        width: @boxWidth;
        background-color: var(--vscode-notebook-cellEditorBackground, var(--vscode-editor-background));
        top: 0;
        bottom: 0;
        margin: auto;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .middle {
        @middleHeight: 320px;
        @middleWidth: 200px;
        height: @middleHeight;
        width: @middleWidth;
        margin: auto;
        bottom: 0;
        top: 0;
        position: relative;

        .info {
            input {
                width: @middleWidth;
                height: 25px;
                box-sizing: border-box;
                padding: 1px;
                padding-left: 3px;
                border: 1px solid transparent;
                outline: none;
                box-shadow: none;
                color: inherit;
                background-color: var(--vscode-editorWidget-border);

                &:focus {
                    border: solid 1px var(--vscode-focusBorder);
                }
            }
        }

        .icon {
            margin: 0 auto;
            height: 128px;
            width: 128px;
            display: block;
        }


        .buttons {
            position: absolute;
            bottom: 0;
            display: flex;
            width: @middleWidth;
            justify-content: space-between;
        }
    }

    .rightWrap {
        top: 0;
        bottom: 0;
        margin: auto;

        .right {
            .box();
        }
    }

    .leftWrap {
        top: 0;
        bottom: 0;
        margin: auto;

        .left {
            .box();
        }
    }
}
</style>
