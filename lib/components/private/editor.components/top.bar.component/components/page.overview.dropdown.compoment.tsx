import { inject, observer } from "mobx-react";
import PageStore from "../../../../../stores/page.store";
import GenericList from "../../../general.components/list.components/generic.list.component/generic.list.component";
import Row from "../../../general.components/row.component/row.component";
import RunningText from "../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.overview.dropdown.compoment.module.scss";
import { Page } from "../../../../../schemas/page.schemas/page.schema";
import { faFolderOpen } from "@fortawesome/pro-regular-svg-icons";
import SmallText from "../../../general.components/text.components/small.text.component/small.text.component";
import Column from "../../../general.components/column.component/column.component";

interface PageOverviewDropdownProps {
  pageStore?: PageStore;
}

const PageOverviewDropdown = ({
  pageStore,
}: PageOverviewDropdownProps): JSX.Element => {
  const currentSelectedPage = pageStore?.currentSelectedPage;
  const pages = pageStore?.pages;

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
        onClick={() => {
          pageStore?.setCurrentSelectedPage(page);
          // setIsPageDropdownOpen(false);
        }}
      >
        <FontAwesomeIcon icon={faFolderOpen} className={styles.codeIcon} />
        <Column>
          <RunningText className={styles.pageName}>{page.name}</RunningText>
          {page.views && page.views.length != 0 && (
            <SmallText> {page.views.length} Views</SmallText>
          )}
        </Column>
      </Row>
    );
  };

  return (
    <div className={styles.pageDropdownWrapper}>
      <GenericList
        title="Pages"
        items={pages ?? []}
        identifierKey="pageID"
        selectedIdentifier={currentSelectedPage?.pageID}
        onSelectItem={(selectedItem: Page) => {
          pageStore?.setCurrentSelectedPage(selectedItem);
          // setIsPageDropdownOpen(false);
        }}
        renderItem={(item: Page) => {
          return buildPageItem(item);
        }}
        onAddNew={() => {}} // Diese Funktion muss definiert sein
      />
    </div>
  );
};

export default inject("pageStore")(observer(PageOverviewDropdown));
