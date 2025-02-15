import { isMobile } from "react-device-detect";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";

import ViewerWrapper from "./sub-components/ViewerWrapper";

import { MediaViewerProps } from "./MediaViewer.props";
import { FileStatus } from "@docspace/common/constants";
import {
  isNullOrUndefined,
  KeyboardEventKeys,
  mapSupplied,
  mediaTypes,
} from "./helpers";
import { getFileExtension } from "@docspace/common/utils";

import InfoOutlineReactSvgUrl from "PUBLIC_DIR/images/info.outline.react.svg?url";
import CopyReactSvgUrl from "PUBLIC_DIR/images/copy.react.svg?url";
import DuplicateReactSvgUrl from "PUBLIC_DIR/images/duplicate.react.svg?url";
import DownloadReactSvgUrl from "PUBLIC_DIR/images/download.react.svg?url";
import RenameReactSvgUrl from "PUBLIC_DIR/images/rename.react.svg?url";
import TrashReactSvgUrl from "PUBLIC_DIR/images/trash.react.svg?url";
import MoveReactSvgUrl from "PUBLIC_DIR/images/move.react.svg?url";

function MediaViewer({
  playlistPos,
  nextMedia,
  prevMedia,
  ...props
}: MediaViewerProps): JSX.Element {
  const TiffXMLHttpRequestRef = useRef<XMLHttpRequest>();

  const [title, setTitle] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string | undefined>(() => {
    const { playlist, currentFileId } = props;
    const item = playlist.find(
      (file) => file.fileId.toString() === currentFileId.toString()
    );
    return item?.src;
  });

  const [targetFile, setTargetFile] = useState(() => {
    const { files, currentFileId } = props;
    return files.find((item) => item.id === currentFileId);
  });

  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    const { playlist } = props;

    return (
      (playlist[playlistPos].fileStatus & FileStatus.IsFavorite) ===
      FileStatus.IsFavorite
    );
  });

  useEffect(() => {
    const fileId = props.playlist[playlistPos]?.fileId;

    if (!isNullOrUndefined(fileId) && props.currentFileId !== fileId) {
      props.onChangeUrl(fileId);
    }
  }, [props.playlist.length]);

  useEffect(() => {
    return () => {
      props.onClose();
    };
  }, []);

  useEffect(() => {
    const { playlist, files, setBufferSelection } = props;

    const currentFile = playlist[playlistPos];

    const currentFileId =
      playlist.length > 0
        ? playlist.find((file) => file.id === playlistPos)?.fileId
        : 0;

    const targetFile = files.find((item) => item.id === currentFileId);

    if (targetFile) setBufferSelection(targetFile);

    const { src, title } = currentFile;

    const ext = getFileExtension(title);

    if (ext === ".tiff" || ext === ".tif") {
      fetchAndSetTiffDataURL(src);
    }
  }, []);

  useEffect(() => {
    const { playlist, onEmptyPlaylistError, files, setBufferSelection } = props;

    const { src, title, fileId } = playlist[playlistPos];
    const ext = getFileExtension(title);

    if (!src) return onEmptyPlaylistError();

    if (ext !== ".tif" && ext !== ".tiff" && src !== fileUrl) {
      TiffXMLHttpRequestRef.current?.abort();
      setFileUrl(src);
    }

    if (ext === ".tiff" || ext === ".tif") {
      setFileUrl(undefined);
      fetchAndSetTiffDataURL(src);
    }

    const foundFile = files.find((file) => file.id === fileId);

    if (!isNullOrUndefined(foundFile)) {
      setTargetFile(foundFile);
      setBufferSelection(foundFile);
    }

    setTitle(title);
    setIsFavorite(
      (playlist[playlistPos].fileStatus & FileStatus.IsFavorite) ===
        FileStatus.IsFavorite
    );
  }, [props.playlist, props.files.length, props.currentFileId, playlistPos]);

  useEffect(() => {
    document.addEventListener("keydown", onKeydown);

    return () => {
      document.removeEventListener("keydown", onKeydown);
      TiffXMLHttpRequestRef.current?.abort();
    };
  }, [
    props.playlist.length,
    props.files.length,
    playlistPos,
    props.deleteDialogVisible,
  ]);

  const getContextModel = () => {
    const {
      t,
      onClickDownload,
      onClickRename,
      onClickDelete,
      onShowInfoPanel,
      onMoveAction,
      onCopyAction,
      onDuplicate,
    } = props;

    if (!targetFile) return [];

    const desktopModel = [
      {
        key: "download",
        label: t("Common:Download"),
        icon: DownloadReactSvgUrl,
        onClick: () => onClickDownload(targetFile, t),
        disabled: false,
      },
      {
        key: "rename",
        label: t("Common:Rename"),
        icon: RenameReactSvgUrl,
        onClick: () => onClickRename(targetFile),
        disabled: archiveRoom,
      },
      {
        key: "delete",
        label: t("Common:Delete"),
        icon: TrashReactSvgUrl,
        onClick: () => onClickDelete(targetFile, t),
        disabled: archiveRoom,
      },
    ];

    const model = [
      {
        id: "option_room-info",
        key: "room-info",
        label: t("Common:Info"),
        icon: InfoOutlineReactSvgUrl,
        onClick: () => {
          return onShowInfoPanel(targetFile);
        },
        disabled: false,
      },
      {
        key: "download",
        label: t("Common:Download"),
        icon: DownloadReactSvgUrl,
        onClick: () => onClickDownload(targetFile, t),
        disabled: false,
      },
      {
        key: "move-to",
        label: t("Common:MoveTo"),
        icon: MoveReactSvgUrl,
        onClick: onMoveAction,
        disabled: !targetFile.security.Move,
      },
      {
        id: "option_copy-to",
        key: "copy-to",
        label: t("Common:Copy"),
        icon: CopyReactSvgUrl,
        onClick: onCopyAction,
        disabled: !targetFile.security.Copy,
      },
      {
        id: "option_create-copy",
        key: "copy",
        label: t("Common:Duplicate"),
        icon: DuplicateReactSvgUrl,
        onClick: () => onDuplicate(targetFile, t),
        disabled: !targetFile.security.Duplicate,
      },
      {
        key: "rename",
        label: t("Common:Rename"),
        icon: RenameReactSvgUrl,
        onClick: () => onClickRename(targetFile),
        disabled: !targetFile.security.Rename,
      },

      {
        key: "separator0",
        isSeparator: true,
        disabled: !targetFile.security.Delete,
      },
      {
        key: "delete",
        label: t("Common:Delete"),
        icon: TrashReactSvgUrl,
        onClick: () => onClickDelete(targetFile, t),
        disabled: !targetFile.security.Delete,
      },
    ];

    return isMobile
      ? model
      : isImage && !isMobile
      ? desktopModel.filter((el) => el.key !== "download")
      : desktopModel;
  };

  const canImageView = useCallback(
    (ext: string) => {
      const { extsImagePreviewed } = props;
      return extsImagePreviewed.indexOf(ext) != -1;
    },
    [props.extsImagePreviewed]
  );

  const canPlay = useCallback(
    (fileTitle: string) => {
      const { extsMediaPreviewed } = props;

      const ext =
        fileTitle[0] === "." ? fileTitle : getFileExtension(fileTitle);

      const supply = mapSupplied[ext];

      return !!supply && extsMediaPreviewed.indexOf(ext) != -1;
    },
    [props.extsMediaPreviewed]
  );

  let lastRemovedFileId: null | number = null;

  const onDelete = () => {
    const { playlist, onDelete } = props;

    let currentFileId = playlist.find((file) => file.id === playlistPos)
      ?.fileId;

    if (currentFileId === lastRemovedFileId) return;

    const canDelete = targetFile?.security?.Delete;

    if (!canDelete) return;

    if (!isNullOrUndefined(currentFileId)) {
      onDelete(currentFileId);
      lastRemovedFileId = currentFileId;
    }
  };

  const onDownload = () => {
    const { playlist, onDownload } = props;

    let currentFileId = playlist.find((file) => file.id === playlistPos)
      ?.fileId;

    if (!isNullOrUndefined(currentFileId)) onDownload(currentFileId);
  };

  const onKeydown = (event: KeyboardEvent) => {
    const { code, ctrlKey } = event;
    if (props.deleteDialogVisible) return;

    if (code in KeyboardEventKeys) {
      const includesKeyboardCode = [
        KeyboardEventKeys.KeyS,
        KeyboardEventKeys.Numpad1,
        KeyboardEventKeys.Digit1,
        KeyboardEventKeys.Space,
      ].includes(code as KeyboardEventKeys);

      if (!includesKeyboardCode || ctrlKey) event.preventDefault();
    }

    switch (code) {
      case KeyboardEventKeys.ArrowLeft:
        if (document.fullscreenElement) return;

        if (!ctrlKey) prevMedia();
        break;

      case KeyboardEventKeys.ArrowRight:
        if (document.fullscreenElement) return;

        if (!ctrlKey) nextMedia();

        break;

      case KeyboardEventKeys.Escape:
        if (!props.deleteDialogVisible) props.onClose();
        break;

      case KeyboardEventKeys.KeyS:
        if (ctrlKey) onDownload();
        break;

      case KeyboardEventKeys.Delete:
        onDelete();
        break;

      default:
        break;
    }
  };

  const onClose = useCallback(() => {
    props.onClose();
  }, [props.onClose]);

  const fetchAndSetTiffDataURL = useCallback((src: string) => {
    if (!window.Tiff) return;

    TiffXMLHttpRequestRef.current?.abort();

    const xhr = new XMLHttpRequest();
    TiffXMLHttpRequestRef.current = xhr;
    xhr.responseType = "arraybuffer";

    xhr.open("GET", src);
    xhr.onload = function () {
      try {
        const tiff = new window.Tiff({ buffer: xhr.response });

        const dataUrl = tiff.toDataURL();

        setFileUrl(dataUrl);
      } catch (e) {
        console.log(e);
      }
    };
    xhr.send();
  }, []);

  const onSetSelectionFile = useCallback(() => {
    props.setBufferSelection(targetFile);
  }, [targetFile]);

  const ext = getFileExtension(title);
  const audioIcon = useMemo(() => props.getIcon(96, ext), [ext]);
  const headerIcon = useMemo(() => props.getIcon(24, ext), [ext]);

  let isVideo = false;
  let isAudio = false;
  let canOpen = true;
  let isImage = false;

  const archiveRoom =
    props.archiveRoomsId === targetFile?.rootFolderId ||
    (!targetFile?.security?.Rename && !targetFile?.security?.Delete);

  if (canPlay(ext) && canImageView(ext)) {
    canOpen = false;
    props.onError?.();
  }

  if (canImageView(ext)) {
    isImage = true;
  } else {
    isImage = false;
    isVideo = mapSupplied[ext]
      ? mapSupplied[ext]?.type == mediaTypes.video
      : false;
    isAudio = mapSupplied[ext]
      ? mapSupplied[ext]?.type == mediaTypes.audio
      : false;
  }

  return (
    <>
      {canOpen && (
        <ViewerWrapper
          userAccess={props.userAccess}
          visible={props.visible}
          title={title}
          onClose={onClose}
          fileUrl={fileUrl}
          inactive={props.playlist.length <= 1}
          playlist={props.playlist}
          playlistPos={playlistPos}
          onNextClick={nextMedia}
          onSetSelectionFile={onSetSelectionFile}
          contextModel={getContextModel}
          onPrevClick={prevMedia}
          onDeleteClick={onDelete}
          isFavorite={isFavorite}
          isImage={isImage}
          isAudio={isAudio}
          isVideo={isVideo}
          isPreviewFile={props.isPreviewFile}
          onDownloadClick={onDownload}
          archiveRoom={archiveRoom}
          errorTitle={props.t("Common:MediaError")}
          headerIcon={headerIcon}
          audioIcon={audioIcon}
        />
      )}
    </>
  );
}

export default MediaViewer;
