import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AddBookComponent } from "./add-book/add-book.component";
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
