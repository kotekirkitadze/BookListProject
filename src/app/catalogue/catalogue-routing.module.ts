import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { CatalogueComponent } from "./catalogue.component";

export const routes: Route[] = [
  {
    path: "",
    component: CatalogueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule { }
