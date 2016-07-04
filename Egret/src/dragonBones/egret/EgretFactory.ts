namespace dragonBones {
    export class EgretFactory extends BaseFactory {
        private _armatureDisplayClass: { new (): EgretArmatureDisplayContainer; } = null;

        public constructor() {
            super();

            if (!Armature._soundEventManager) {
                Armature._soundEventManager = new EgretArmatureDisplayContainer();
            }
        }
		/**
		 * @private
		 */
        protected _generateTextureAtlasData(textureAtlasData: TextureAtlasData, textureAtlas: any): TextureAtlasData {
            if (textureAtlasData) {
                (<EgretTextureAtlasData>textureAtlasData).texture = <egret.Texture>textureAtlas;
            } else {
                textureAtlasData = BaseObject.borrowObject(EgretTextureAtlasData);
            }

            return textureAtlasData;
        }
		/**
		 * @private
		 */
        protected _generateArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplayContainer = this._armatureDisplayClass ? new this._armatureDisplayClass() : new EgretArmatureDisplayContainer();

            armature._armatureData = dataPackage.armature;
            armature._skinData = dataPackage.skin;
            armature._animation = BaseObject.borrowObject(Animation);
            armature._display = armatureDisplayContainer;

            armatureDisplayContainer._armature = armature;
            armature._animation._armature = armature;

            armature.animation.animations = dataPackage.armature.animations;

            this._armatureDisplayClass = null;

            return armature;
        }
		/**
		 * @private
		 */
        protected _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet): Slot {
            const slot = BaseObject.borrowObject(EgretSlot);
            const slotData = slotDisplayDataSet.slot;
            const displayList = [];

            slot.name = slotData.name;
            slot._rawDisplay = new egret.Bitmap();
            slot._meshDisplay = new egret.Mesh();

            for (let i in slotDisplayDataSet.displays) {
                const displayData = slotDisplayDataSet.displays[i];
                switch (displayData.type) {
                    case DisplayType.Image:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }

                        displayList.push(slot._rawDisplay);
                        break;

                    case DisplayType.Mesh:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }

                        displayList.push(egret.Capabilities.renderMode == "webgl" ? slot._meshDisplay : slot._rawDisplay);
                        break;

                    case DisplayType.Armature:
                        const childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                        if (childArmature) {
                            childArmature.animation.play();
                        }

                        displayList.push(childArmature);
                        break;

                    default:
                        displayList.push(null);
                        break;
                }
            }

            slot._setDisplayList(displayList);

            return slot;
        }
		/**
		 * 
		 */
        public buildArmatureDisplay<T extends EgretArmatureDisplayContainer>(armatureName: string, dragonBonesName: string = null, skinName: string = null, displayClass: { new (): T; } = null): T {
            this._armatureDisplayClass = displayClass;

            const armature = this.buildArmature(armatureName, dragonBonesName, skinName);
            const armatureDisplay = armature ? <T>armature._display : null;
            if (armatureDisplay) {
                armatureDisplay.advanceTimeBySelf(true);
            }

            return armatureDisplay;
        }

        public getSoundEventManater(): EgretArmatureDisplayContainer {
            return <EgretArmatureDisplayContainer>Armature._soundEventManager;
        }

        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.addDragonBonesData()
         */
        public addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName: string = null): void {
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        }
        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.getDragonBonesData()
         */
        public getSkeletonData(dragonBonesName: string) {
            return this.getDragonBonesData(dragonBonesName);
        }
        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.removeSkeletonData()
         */
        public removeSkeletonData(dragonBonesName: string): void {
            this.removeSkeletonData(dragonBonesName);
        }
        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.addTextureAtlasData()
         */
        public addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName: string = null): void {
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        }
        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.getTextureAtlasData()
         */
        public getTextureAtlas(dragonBonesName: string) {
            return this.getTextureAtlasData(dragonBonesName);
        }
        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.removeTextureAtlasData()
         */
        public removeTextureAtlas(dragonBonesName: string): void {
            this.removeTextureAtlasData(dragonBonesName);
        }
		/**
         * 不推荐使用
		 * @see #dragonBones.BaseFactory.buildArmature()
		 */
        public buildFastArmature(armatureName: string, dragonBonesName: string = null, skinName: string = null): FastArmature {
            return this.buildArmature(armatureName, dragonBonesName, skinName);
        }
    }
}