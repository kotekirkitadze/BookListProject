import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AddBookComponent } from "./add-book/add-book.component";
import { BookDetailsComponent } from "./book-details/book-details.component";
import { CatalogueComponent } from "./catalogue.component";
import { UserComponent } from "./user/user.component";

export const routes: Route[] = [
  {
    path: "",
    component: CatalogueComponent
  },
  {
    path: 'add-book',
    component: AddBookComponent
  },
  {
    path: "user",
    component: UserComponent
  },
  {
    path: ":id",
    component: BookDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
