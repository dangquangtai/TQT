import * as actionTypes from './actions';

export const initialState = {
  folder: false,
  document: false,
  detailDocument: false,
  accountDocument: false,
  departmentDocument: false,
  processDeptDocument: false,
  processUserDocument: false,
  processrolecode: '',
  categoryDocument: false,
  productDocument: false,
  orderDocument: false,
  order_id: '',
  customerDocument: false,
  supplierDocument: false,
  materialInventoryDocument: false,
  materialInventoryCheckDocument: false,
  purchaseMaterialDocument: false,
};

const floatingMenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FLOATING_MENU_CHANGE:
      return {
        ...state,
        folder: action.folder,
        document: action.document,
        detailDocument: action.detailDocument,
        accountDocument: action.accountDocument,
        departmentDocument: action.departmentDocument,
        processDeptDocument: action.processDeptDocument,
        processUserDocument: action.processUserDocument,
        processrolecode: action.processrolecode,
        categoryDocument: action.categoryDocument,
        productDocument: action.productDocument,
        orderDocument: action.orderDocument,
        order_id: action.order_id,
        customerDocument: action.customerDocument,
        supplierDocument: action.supplierDocument,
        materialInventoryDocument: action.materialInventoryDocument,
        materialInventoryCheckDocument: action.materialInventoryCheckDocument,
        purchaseMaterialDocument: action.purchaseMaterialDocument,
        receivedMaterialDocument: action.receivedMaterialDocument,
        materialWarehouseDocument: action.materialWarehouseDocument,
        workshopDocument: action.workshopDocument,
        productWarehouseDocument: action.productWarehouseDocument,
        goodsIssueDocument: action.goodsIssueDocument,
        goodsReceiptDocument: action.goodsReceiptDocument,
        dailyMaterialReceivedDocument: action.dailyMaterialReceivedDocument,
        dailyWMaterialRequisitionDocument: action.dailyWMaterialRequisitionDocument,
      };
    default:
      return state;
  }
};

export default floatingMenuReducer;
