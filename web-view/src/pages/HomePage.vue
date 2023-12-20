<script setup lang="ts">
import { useRouter } from "vue-router";
import { extensionStore } from "../store";
import DownLoadAndUpLoad from "../components/DownLoadAndUpLoad.vue"
import SimpleTip from "../components/SimpleTip.vue";
import { Cmd, Msg, vscode, Extension, getExtensionId, Res, extensionsPostResolver } from "../utils";
import {
    provideVSCodeDesignSystem,
    vsCodeDivider,
    vsCodeBadge,
    vsCodeButton
} from "@vscode/webview-ui-toolkit";
provideVSCodeDesignSystem().register(
    vsCodeDivider(),
    vsCodeBadge(),
    vsCodeButton()
);


const extensions = extensionStore()
const router = useRouter();
function deleteExtension(data: Extension) {
    vscode.postMessage(new Msg(Cmd.deleteExtension, data), (res: string) => {
        if (<Res>JSON.parse(res).success) {
            extensions.getExtensions();
        }
    })
}
extensions.getExtensions();

function update(item?: Extension) {
    extensions.updatePage.extensionList = [...extensions.extensionArray];
    extensions.updatePage.extensionPack = [];
    extensions.updatePage.currentExtension = new Extension();
    if (item) {
        extensions.updatePage.isUpdate = true;
        extensions.updatePage.currentExtension = Extension.copy(item);
        extensions.updatePage.extensionList = extensions.extensionArray.filter(e => !item.pck.extensionPack.includes(getExtensionId(e)));
        extensions.updatePage.extensionPack = extensions.extensionArray.filter(e => item.pck.extensionPack.includes(getExtensionId(e)));
    }
    router.push({
        name: "update"
    })
    extensionsPostResolver(extensions.updatePage.extensionList)
    extensionsPostResolver(extensions.updatePage.extensionPack)
}
function resolveClick(item: Extension) {
    item.isClicked = !item.isClicked;
}
function pack(item: Extension) {
    vscode.postMessage(new Msg(Cmd.pack, item));
}
</script>

<template>
    <div class="outer px-12px">
        <div class="top">
            <DownLoadAndUpLoad :extension-pack-arr="extensions.customExtensionPack"
                :call-back="() => { extensions.getExtensions() }">
            </DownLoadAndUpLoad>
            <h1 class="title">Extension Pack Management</h1>
            <div class="buttonWraper" @click="update()">
                <vscode-button class="create">
                    <div class="icon">
                        <svg t="1684482151439" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="3318" width="18" height="18">
                            <path
                                d="M588.8 435.2h358.4a76.8 76.8 0 1 1 0 153.6h-358.4v358.4a76.8 76.8 0 1 1-153.6 0v-358.4h-358.4a76.8 76.8 0 1 1 0-153.6h358.4v-358.4a76.8 76.8 0 1 1 153.6 0v358.4z"
                                p-id="3319"></path>
                        </svg>
                    </div>
                    <div class="info">Create</div>
                </vscode-button>
            </div>
        </div>
        <vscode-divider></vscode-divider>
        <div class="bottom">
            <div class="intoduction" v-if="!extensions.customExtensionPack.length">
                click the button and create your first extension pack🎇
            </div>
            <div class="item p-6px" v-for="item in extensions.customExtensionPack" :key="`extension:${item?.dirName}`">
                <div class="flex justify-around w-full" :class="{ extensionPack: true, activeExtensionPack: item.isClicked }"
                    @click="resolveClick(item)">
                    <div class="relative h-full w-full flex items-center">
                        <div>
                            <img :src="item.img" class="logo" draggable="false">
                            <vscode-badge class="packNum"
                                :style="{ visibility: item?.pck?.extensionPack?.length ? 'visible' : 'hidden' }">
                                {{ item?.pck?.extensionPack?.length }}
                            </vscode-badge>
                        </div>
                        <div class="info">
                            <h3 class="displayName">{{ item?.pck?.displayName }}</h3>
                            <p class="discription">{{ item?.pck?.description }}</p>
                            <h4 class="publisher">{{ item?.pck?.publisher }}</h4>
                        </div>

                    </div>
                    <div class="flex gap-12px h-full w-full items-center justify-end">
                        <div class="zip" @click.stop="pack(item)">
                            <SimpleTip content="pack" top="-20px" height="15px" width="34px" padding-top="1px"
                                right="-28px">
                                <svg t="1700831622536" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="19087" width="20" height="20">
                                    <path
                                        d="M869.898 595.954c-15.331 0-27.874 12.543-27.874 27.874v39.922h-0.001v237.5H121.014v-776h332.631v-0.034h128.899c16.491 0 29.983-13.492 29.983-29.983S599.035 65.25 582.544 65.25h-461.53c-30.661 0-55.748 27-55.748 60v776c0 33 25.087 60 55.748 60h721.009c30.661 0 55.748-27 55.748-60V792.997l0.001-0.043V623.828c0-15.331-12.543-27.874-27.874-27.874z"
                                        p-id="19088"></path>
                                    <path
                                        d="M952.522 295.341a30.213 30.213 0 0 0-1.686-1.549L839.452 182.404c-11.661-11.662-30.742-11.662-42.403 0-11.66 11.66-11.66 30.741 0 42.401l66.3 66.302H713.881c-111.357 0-217.122 42.827-297.81 120.591-80.459 77.543-127.2 181.247-131.611 292.007-0.66 16.555 12.227 30.511 28.782 31.17 0.407 0.016 0.811 0.023 1.215 0.023 16.017 0 29.312-12.658 29.955-28.806 3.792-95.228 44.028-184.437 113.295-251.193 69.448-66.932 160.426-103.792 256.174-103.792h140.474l-57.306 57.308c-11.66 11.66-11.66 30.741 0 42.401 11.661 11.661 30.742 11.661 42.403 0l111.383-111.387a29.902 29.902 0 0 0 1.687-1.55c5.847-5.847 8.761-13.561 8.743-21.269 0.018-7.708-2.896-15.422-8.743-21.269z"
                                        p-id="19089"></path>
                                </svg>
                            </SimpleTip>
                        </div>

                        <div class="edit" @click.stop="update(item)">
                            <SimpleTip content="edit" top="-20px" height="15px" width="34px" padding-top="1px"
                                right="-30px">
                                <svg t="1684230815052" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22">
                                    <path
                                        d="M800 959.96l-576 0c-52.9 0-96-43.1-96-96l0-640c0-52.9 43.1-96 96-96l448 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-448 0c-17.6 0-32 14.4-32 32l0 640c0 17.7 14.4 32 32 32l576 0c17.7 0 32-14.3 32-32l0-512c0-17.7 14.3-32 32-32s32 14.3 32 32l0 512C896 916.96 852.9 959.96 800 959.96zM511.7 542.76c-8.3 0-16.5-3.2-22.8-9.5-12.4-12.6-12.3-32.8 0.3-45.2l418.3-413.7c12.6-12.4 32.8-12.3 45.2 0.3 12.4 12.6 12.3 32.8-0.3 45.2l-418.3 413.7C527.9 539.66 519.8 542.76 511.7 542.76z"
                                        p-id="4209"></path>
                                </svg>
                            </SimpleTip>
                        </div>

                        <div class="delete" @click.stop="deleteExtension(item)">
                            <SimpleTip content="delete" top="-20px" height="15px" width="40px" padding-top="1px"
                                right="-35px">
                                <svg t="1684230900952" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="6035" width="33" height="33">
                                    <path
                                        d="M656 288h144a16 16 0 0 1 16 16v16a16 16 0 0 1-16 16h-48v496a16 16 0 0 1-16 16H288a16 16 0 0 1-16-16V336h-48a16 16 0 0 1-16-16v-16a16 16 0 0 1 16-16h144v-80a16 16 0 0 1 16-16h256a16 16 0 0 1 16 16v80z m-48 0v-48H416v48h192z m32 48H320v464h384V336h-64z m-208 112h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z m144 0h16a16 16 0 0 1 16 16v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V464a16 16 0 0 1 16-16z"
                                        p-id="6036"></path>
                                </svg>
                            </SimpleTip>
                        </div>

                    </div>
                </div>
                <div class="secondaryExtensionPack" v-show="item.isClicked"
                    v-for="packItem in extensions.getExtensionInPack(item?.pck?.extensionPack)"
                    :key="`pack:${packItem?.dirName}`">
                    <img :src="packItem.img" class="logo" draggable="false">
                    <vscode-badge class="packNum"
                        :style="{ visibility: packItem?.pck?.extensionPack?.length ? 'visible' : 'hidden' }">
                        {{ packItem?.pck?.extensionPack?.length }}
                    </vscode-badge>
                    <div class="info">
                        <h3 class="displayName">{{ packItem?.pck?.displayName }}</h3>
                        <p class="discription">{{ packItem?.pck?.description }}</p>
                        <h4 class="publisher">{{ packItem?.pck?.publisher }}</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
@minHeight: 350px;
@outerHeight: 100vh;
@outerWidth: 90%;

@topPadding: 50px;
@topHeight: 50px;
@topWidth: @outerWidth;

@bottomWidth: @outerWidth;
@bottomHeight: 75vh;

@extensionPackWidth: @bottomWidth * 0.98;
@extensionPackHeight: 100px;
@extensionPackMargin: 0.1 * @extensionPackHeight;

@packNumPaddingTop: @extensionPackHeight*0.7;

@buttonHeight: 40px;
@buttonWidth: 120px;

@topMarginTop: @topHeight*0.5;

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

.align() {
    top: 50%;
    transform: translateY(-50%);
}



.outer {
    .alignHorizontal(@outerHeight, @outerWidth);

    .intoduction {
        font-style: italic;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size: 30px;
        position: absolute;
        top: 200px;
        width: 727px;
        left: 50%;
        transform: translateX(-50%);
    }

    .top {

        display: flex;
        justify-content: space-between;
        line-height: 0;
        .alignHorizontal(@topHeight, @topWidth);
        padding-top: @topPadding;

        .create {
            .alignVertical();
            height: @buttonHeight;
            width: @buttonWidth;
            display: flex;
            justify-content: space-around;
            position: relative;

            .icon {
                position: absolute;
                left: @buttonWidth * 0.05;
                .align();
            }

            .info {
                position: absolute;
                right: @buttonWidth * 0.2;
                font-size: 18px;
                font-weight: bold;
                .align();
            }
        }

    }

    .bottom {

        min-height: @minHeight;
        cursor: pointer;
        overflow-y: auto;
        overflow-x: hidden;
        .alignHorizontal(@bottomHeight, @bottomWidth);


        .item {
            box-sizing: border-box;


            .extensionPack {
                box-sizing: border-box;

                min-height: 65px;
                display: flex;
                position: relative;
                width: @extensionPackWidth;
                height: @extensionPackHeight;
                border: 1px solid transparent;
                padding: @extensionPackHeight * 0.1 0;
                padding-left: @extensionPackWidth * 0.01;

                .logo {
                    height: @extensionPackHeight * 0.8;
                    width: $height;
                }

                &:hover {
                    //vscode本身定义的变量
                    background-color: var(--vscode-commandCenter-background);
                }

                .packNum {
                    position: absolute;
                    bottom: 0;
                    left: @extensionPackWidth * 0.01;
                }

                .info {
                    padding-left: @extensionPackWidth * 0.02;
                    line-height: 0;
                    .alignVertical();
                    overflow: hidden;
                    width: @extensionPackWidth*0.65;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .buttonSize() {
                    height: 24px;
                    width: 24px;
                }

                .zip {
                    // position: absolute;
                    // right: @extensionPackWidth * 0.2;
                    padding-left: 2px;
                    .buttonSize();
                    .align();

                    .icon {
                        fill: currentColor;
                        position: absolute;
                        transform: translateY(9%);
                    }

                    &:hover {
                        //vscode本身定义的变量
                        background-color: var(--vscode-scrollbarSlider-hoverBackground);
                    }
                }

                .delete {
                    // position: absolute;
                    // right: 96px;

                    &:hover {
                        //vscode本身定义的变量
                        background-color: var(--vscode-scrollbarSlider-hoverBackground);
                    }

                    .buttonSize();
                    .align();

                    .icon {
                        fill: currentColor;
                        position: absolute;
                        transform: translateY(-3px) translateX(-4px);
                        top: -10%;
                    }
                }

                .edit {
                    // position: absolute;
                    // right: @extensionPackWidth * 0.15;

                    &:hover {
                        //vscode本身定义的变量
                        background-color: var(--vscode-scrollbarSlider-hoverBackground);
                    }

                    .buttonSize();
                    .align();

                    .icon {
                        fill: currentColor;
                        transform: translateY(2px) translateX(1px);
                        position: absolute;
                        top: 10%;
                    }
                }
            }

            .activeExtensionPack {
                background-color: var(--vscode-commandCenter-background);
                border: solid 1px var(--vscode-focusBorder);
            }

            .secondaryExtensionPack {
                .extensionPack();
                height: @extensionPackHeight * 0.65;
                padding: @extensionPackHeight * 0.05 0;
                padding-left: @extensionPackWidth * 0.01 + 0.11 * @extensionPackHeight ;
                opacity: .5;

                .logo {
                    height: @extensionPackHeight * 0.55;
                    width: $height;
                }

                .info {
                    padding-left: @extensionPackWidth * 0.02 + @extensionPackHeight * 0.105;
                    font-size: 12px;
                }

                &:hover {
                    opacity: 1;
                }
            }
        }
    }
}
</style>
