import { inject, observer } from "mobx-react";
import PageStore from "../../../../../../stores/page.store";
import GenericList from "../../../../general.components/list.components/generic.list.component/generic.list.component";
import Row from "../../../../general.components/row.component/row.component";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.overview.dropdown.compoment.module.scss";
import { Page } from "../../../../../../schemas/page.schemas/page.schema";
import { faEdit, faFolderOpen } from "@fortawesome/pro-regular-svg-icons";
import SmallText from "../../../../general.components/text.components/small.text.component/small.text.component";
import Column from "../../../../general.components/column.component/column.component";
import IconButton from "../../../../general.components/icon.button.component/icon.button.component";
import { useEffect, useState } from "react";
import PageDetailSidebar from "../page.detail.sidebar.component/page.detail.sidebar.component";

interface PageOverviewDropdownProps {
  pageStore?: PageStore;
  onSelectedPageChange?: (page: Page) => void;
  isPageSelected?: (isSelected: boolean) => void;
}

const PageOverviewDropdown = ({
  pageStore,
  onSelectedPageChange,
  isPageSelected,
}: PageOverviewDropdownProps): JSX.Element => {
  const currentSelectedPage = pageStore?.currentPageToRender;
  const pages = pageStore?.pages;

  const [selectedItem, setSelectedItem] = useState<Page | undefined>(undefined);

  const [isEditing, setIsEditing] = useState<boolean>(
    selectedItem?.pageID != "new"
  );

  useEffect(() => {
    // TODO prepared for adding new page
    if (selectedItem?.pageID === "new") {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }

    if (isPageSelected) {
      isPageSelected(selectedItem != null);
    }
  }, [selectedItem]);

  const handleEditPage = (pageID: string | null) => {
    if (pageID == null) return;

    const query = pageStore?.getPage(pageID);
    setSelectedItem(query);
  };

  const handlePageSelection = (page: Page) => {
    pageStore?.setCurrentPageToRender(page);

    if (onSelectedPageChange) {
      onSelectedPageChange(page);
    }
  };

  const itemClassName = (pageID: string | undefined) => {
    return (
      styles.pageItem +
      " " +
      (currentSelectedPage?.pageID === pageID ? styles.currentSelected : "")
    );
  };

  const buildPageItem = (page: Page) => {
    return (
      <Row
        alignItems="center"
        className={itemClassName(page?.pageID)}
        key={page?.pageID}
        onClick={() => handlePageSelection(page)}
      >
        <FontAwesomeIcon icon={faFolderOpen} className={styles.codeIcon} />
        <Column>
          <RunningText className={styles.pageName}>{page.name}</RunningText>
          {page.views && page.views.length != 0 && (
            <SmallText> {page.views.length} Views</SmallText>
          )}
        </Column>
        <IconButton
          icon={faEdit}
          onClick={() => {
            handleEditPage(page?.pageID);
          }}
        />
      </Row>
    );
  };

  return (
    <div className={styles.pageDropdownWrapper}>
      <div className={styles.pagesOverviewList}>
        <GenericList
          title="Pages"
          items={pages ?? []}
          identifierKey="pageID"
          selectedIdentifier={currentSelectedPage?.pageID}
          onSelectItem={(selectedItem: Page) => {
            pageStore?.setAndFetchPageToRender(selectedItem?.pageID);
          }}
          renderItem={(item: Page) => {
            return buildPageItem(item);
          }}
          onAddNew={() => {}} // TODO
        />
      </div>
      {selectedItem != null && (
        <PageDetailSidebar
          selectedItem={selectedItem}
          isEditing={isEditing}
          onClose={() => setSelectedItem(undefined)}
        />
      )}
    </div>
  );
};

export default inject("pageStore")(observer(PageOverviewDropdown));
